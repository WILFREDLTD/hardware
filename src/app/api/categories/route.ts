import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    });

    return NextResponse.json(categories.map((category) => category.name));
  } catch (err: any) {
    console.error('/api/categories GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
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
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const existing = await prisma.category.findFirst({
      where: { userId: session.user.id, name },
    });

    if (existing) {
      return NextResponse.json({ success: true, name });
    }

    await prisma.category.create({
      data: {
        name,
        user: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json({ success: true, name });
  } catch (err: any) {
    console.error('/api/categories POST error:', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
