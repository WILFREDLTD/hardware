import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saleSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
      discount: z.number().nonnegative().optional(),
      total: z.number().nonnegative().optional(),
    })
  ),
  paymentStatus: z.enum(["PAID", "DEBT"]),
  paymentMethod: z.enum(["CASH", "MPESA"]).optional(),
  paidAmount: z.number().nonnegative().optional(),
  debtAmount: z.number().nonnegative().optional(),
  subtotalAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  finalAmount: z.number().nonnegative().optional(),
  mobileNumber: z.string().optional(),
  notes: z.string().optional(),
  debtorName: z.string().optional(),
  debtorPhone: z.string().optional(),
  saleDate: z.string().datetime().optional(),
});

// GET - List all sales
export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      where: { deletedAt: null },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
        debt: true,
      },
      orderBy: { saleDate: "desc" },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("/api/sales GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

// POST - Create new sale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, paymentStatus, paymentMethod, paidAmount, mobileNumber, notes, debtorName, debtorPhone, saleDate, subtotalAmount, discountAmount, finalAmount } =
      saleSchema.parse(body);

    // Validate stock availability
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.currentStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product?.name || "product"}` },
          { status: 400 }
        );
      }
    }

    const originalSubtotal = typeof subtotalAmount === "number" ? subtotalAmount : items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const derivedDiscount = typeof discountAmount === "number"
      ? discountAmount
      : (typeof finalAmount === "number" ? Math.max(0, originalSubtotal - finalAmount) : 0);
    const totalAmount = typeof finalAmount === "number"
      ? Math.min(Math.max(finalAmount, 0), originalSubtotal)
      : items.reduce((sum, item) => sum + (item.total ?? item.unitPrice * item.quantity), 0);
    const saleItemsData = items.map((item) => {
      const lineSubtotal = item.unitPrice * item.quantity;
      const lineDiscount = originalSubtotal > 0 ? (lineSubtotal / originalSubtotal) * derivedDiscount : 0;
      const lineTotal = Math.max(0, lineSubtotal - lineDiscount);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: lineDiscount,
        total: lineTotal,
      };
    });

    // Create sale
    let sale = await prisma.sale.create({
      data: {
        saleDate: saleDate ? new Date(saleDate) : new Date(),
        subtotalAmount: originalSubtotal,
        discountAmount: derivedDiscount,
        totalAmount,
        paymentStatus,
        notes: [
          paymentMethod && `Method: ${paymentMethod}`,
          paidAmount && `Paid: KES ${paidAmount.toFixed(2)}`,
          mobileNumber && `Mobile: ${mobileNumber}`,
          notes,
        ]
          .filter(Boolean)
          .join(' | ') || undefined,
        saleItems: {
          create: saleItemsData,
        },
      },
      include: {
        saleItems: true,
      },
    });

    // Create debt if payment status is DEBT
    if (paymentStatus === "DEBT") {
      const paid = typeof paidAmount === 'number' ? paidAmount : 0
      const debtStatus = paid > 0 ? 'PARTIAL' : 'PENDING'

      await prisma.debt.create({
        data: {
          saleId: sale.id,
          debtorName: debtorName ?? '',
          debtorPhone: debtorPhone ?? '',
          amount: totalAmount,
          amountPaid: paid,
          status: debtStatus,
          notes: notes,
        },
      });

      // fetch sale with debt included so caller receives debt id
      const saleWithDebt = await prisma.sale.findUnique({
        where: { id: sale.id },
        include: { saleItems: true, debt: true },
      });

      if (saleWithDebt) {
        // replace sale variable for return
        // @ts-ignore
        sale = saleWithDebt
      }
    }

    // Update product stock
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (product) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { currentStock: product.currentStock - item.quantity },
        });

        // Record transaction
        await prisma.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "OUT",
            quantity: item.quantity,
            notes: `Sale: ${sale.id}`,
          },
        });
      }
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    console.error("/api/sales POST error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}
