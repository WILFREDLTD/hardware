import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  debtorName: z.string().optional(),
  debtorPhone: z.string().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { debtorName, debtorPhone } = updateSchema.parse(body);

    const debt = await prisma.debt.findUnique({ where: { id: params.id } });
    if (!debt || debt.userId !== session.user.id) {
      return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
    }

    const updated = await prisma.debt.update({
      where: { id: params.id },
      data: {
        debtorName: debtorName ?? debt.debtorName,
        debtorPhone: debtorPhone ?? debt.debtorPhone,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('/api/debts/[id] PATCH error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update debt' }, { status: 500 });
  }
}
