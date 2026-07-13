import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const unitSchema = z.object({
  unit: z.string().min(1).transform((val) => val.toLowerCase()),
});

export async function GET() {
  try {
    const units = await prisma.baseUnit.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(units.map((unit) => unit.name));
  } catch (error: any) {
    console.error('Error fetching base units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch base units' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unit } = unitSchema.parse(body);

    const existing = await prisma.baseUnit.findUnique({ where: { name: unit } });
    if (existing) {
      return NextResponse.json({ error: 'Unit already exists' }, { status: 400 });
    }

    const created = await prisma.baseUnit.create({ data: { name: unit } });
    return NextResponse.json({ unit: created.name, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating base unit:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create base unit' },
      { status: 500 }
    );
  }
}
