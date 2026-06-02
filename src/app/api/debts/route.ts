import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const debtSchema = z.object({
  debtorName: z.string().min(1),
  debtorPhone: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// GET - List all debts
export async function GET() {
  try {
    const debts = await prisma.debt.findMany({
      include: {
        payments: true,
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(debts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch debts" },
      { status: 500 }
    );
  }
}

// POST - Create new debt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { debtorName, debtorPhone, amount, dueDate, notes } =
      debtSchema.parse(body);

    const debt = await prisma.debt.create({
      data: {
        debtorName,
        debtorPhone,
        amount,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: "PENDING",
        notes,
      },
    });

    return NextResponse.json(debt, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create debt" },
      { status: 500 }
    );
  }
}
