import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().positive(),
  notes: z.string().optional(),
});

// POST - Record payment for a debt
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { amount, notes } = paymentSchema.parse(body);

    const debt = await prisma.debt.findUnique({
      where: { id: params.id },
    });

    if (!debt) {
      return NextResponse.json(
        { error: "Debt not found" },
        { status: 404 }
      );
    }

    if (debt.status === "PAID") {
      return NextResponse.json(
        { error: "Debt already paid" },
        { status: 400 }
      );
    }

    const newAmountPaid = debt.amountPaid + amount;

    if (newAmountPaid > debt.amount) {
      return NextResponse.json(
        { error: "Payment amount exceeds debt" },
        { status: 400 }
      );
    }

    // Record payment
    const payment = await prisma.debtPayment.create({
      data: {
        debtId: params.id,
        amount,
        notes,
      },
    });

    // Determine new status
    let newStatus: string = debt.status;
    if (newAmountPaid === debt.amount) {
      newStatus = "PAID";
    } else if (newAmountPaid > 0) {
      newStatus = "PARTIAL";
    }

    // Update debt
    const updatedDebt = await prisma.debt.update({
      where: { id: params.id },
      data: {
        amountPaid: newAmountPaid,
        status: newStatus as any,
      },
    });

    return NextResponse.json(
      { payment, debt: updatedDebt },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
