import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const stockTransactionSchema = z.object({
  productId: z.string(),
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
  date: z.string().datetime().optional(),
});

// POST - Record inventory transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, type, quantity, notes, date } =
      stockTransactionSchema.parse(body);

    // Get current product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate new stock
    const newStock =
      type === "IN" ? product.currentStock + quantity : product.currentStock - quantity;

    if (newStock < 0) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Record transaction
    const transaction = await prisma.inventoryTransaction.create({
      data: {
        productId,
        type,
        quantity,
        notes,
        date: date ? new Date(date) : new Date(),
      },
    });

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
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
