import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saleSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ),
  paymentStatus: z.enum(["PAID", "DEBT"]),
  paymentMethod: z.enum(["CASH", "MPESA"]).optional(),
  paidAmount: z.number().positive().optional(),
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
    const { items, paymentStatus, paymentMethod, paidAmount, mobileNumber, notes, debtorName, debtorPhone, saleDate } =
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

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        saleDate: saleDate ? new Date(saleDate) : new Date(),
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
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        saleItems: true,
      },
    });

    // Create debt if payment status is DEBT
    if (paymentStatus === "DEBT" && debtorName && debtorPhone) {
      await prisma.debt.create({
        data: {
          saleId: sale.id,
          debtorName,
          debtorPhone,
          amount: totalAmount,
          status: "PENDING",
        },
      });
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
