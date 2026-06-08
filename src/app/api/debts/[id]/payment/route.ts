import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'MPESA']).optional().default('CASH'),
  mobileNumber: z.string().optional(),
  notes: z.string().optional(),
});

// POST - Record payment for a debt
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const body = await request.json();
    const { amount, paymentMethod, mobileNumber, notes } = paymentSchema.parse(body);

    if (paymentMethod === 'MPESA' && !mobileNumber?.match(/^\d{10}$/)) {
      return NextResponse.json(
        { error: 'Invalid mobile number for M-Pesa' },
        { status: 400 }
      );
    }

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

    const defaultNote = paymentMethod === 'MPESA'
      ? `Debt repayment via M-Pesa to ${mobileNumber}`
      : 'Debt repayment via cash';

    // Record payment
    const payment = await prisma.debtPayment.create({
      data: {
        debtId: params.id,
        amount,
        notes: notes ?? defaultNote,
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
    console.error("/api/debts/[id]/payment POST error:", error);
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
