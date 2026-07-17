import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const phoneSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return value;
}, z.string().regex(/^(?:\d{10}|\d{12})$/, 'Phone must be exactly 10 or 12 digits').optional());

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const suppliers = await prisma.supplier.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, phone: true },
    });

    return NextResponse.json(suppliers);
  } catch (err: any) {
    console.error('/api/suppliers GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body?.name || '').trim();
    const phone = String(body?.phone || '').trim();

    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    // Validate phone if provided
    const validatedPhone = phoneSchema.parse(phone || undefined);

    const existing = await prisma.supplier.findFirst({
      where: { userId: session.user.id, name },
    });

    if (existing) {
      return NextResponse.json({ success: true, id: existing.id, name: existing.name, phone: existing.phone });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        phone: validatedPhone || null,
        user: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json({ success: true, id: supplier.id, name: supplier.name, phone: supplier.phone });
  } catch (err: any) {
    console.error('/api/suppliers POST error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid phone format', details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
