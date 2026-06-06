import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSyncEvent } from "@/lib/sync";
import { z } from "zod";

const stockTransactionSchema = z.object({
  productId: z.string(),
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().int().nonnegative().optional(),
  packageCount: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
  date: z.string().datetime().optional(),
});

// GET - List latest inventory transactions for a product
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const transactions = await prisma.inventoryTransaction.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('/api/inventory/stock GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory transactions' },
      { status: 500 }
    );
  }
}

// DELETE - Revert a recent inventory transaction
export async function DELETE(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get('id');
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction id is required' },
        { status: 400 }
      );
    }

    const transaction = await prisma.inventoryTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const recentTransactions = await prisma.inventoryTransaction.findMany({
      where: { productId: transaction.productId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const isRecent = recentTransactions.some((item) => item.id === transactionId);
    if (!isRecent) {
      return NextResponse.json(
        { error: 'Only the last three transactions may be reverted' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: transaction.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const revertedStock =
      transaction.type === 'IN'
        ? product.currentStock - transaction.quantity
        : product.currentStock + transaction.quantity;

    if (revertedStock < 0) {
      return NextResponse.json(
        { error: 'Revert would create negative stock' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.product.update({
        where: { id: product.id },
        data: { currentStock: revertedStock },
      }),
      prisma.inventoryTransaction.delete({
        where: { id: transactionId },
      }),
    ]);

    return NextResponse.json({ success: true, currentStock: revertedStock });
  } catch (error: any) {
    console.error('/api/inventory/stock DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to revert inventory transaction' },
      { status: 500 }
    );
  }
}

// POST - Record inventory transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, type, quantity, packageCount, notes, date } = stockTransactionSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let unitQuantity = quantity;
    if (!unitQuantity && packageCount) {
      if (!product.packageSize) {
        return NextResponse.json(
          { error: "Product conversion size is not defined" },
          { status: 400 }
        );
      }
      unitQuantity = packageCount * product.packageSize;
    }

    if (!unitQuantity || unitQuantity <= 0) {
      return NextResponse.json(
        { error: "Quantity or package count is required" },
        { status: 400 }
      );
    }

    const newStock =
      type === "IN" ? product.currentStock + unitQuantity : product.currentStock - unitQuantity;

    if (newStock < 0) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    const transaction = await prisma.inventoryTransaction.create({
      data: {
        productId,
        type,
        quantity: unitQuantity,
        notes,
        date: date ? new Date(date) : new Date(),
        syncStatus: "PENDING",
      },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });

    await createSyncEvent("INVENTORY_TRANSACTION", transaction.id, "CREATE", {
      transaction,
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("/api/inventory/stock POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to record transaction" },
      { status: 500 }
    );
  }
}
