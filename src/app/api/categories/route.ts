import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // Ensure table exists (safe to run repeatedly)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "hardware"."categories" (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        createdAt TIMESTAMPTZ DEFAULT now()
      )`;

    const rows = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM "hardware"."categories" ORDER BY createdAt DESC
    `;

    return NextResponse.json(rows.map((r) => r.name));
  } catch (err: any) {
    console.error('/api/categories GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "hardware"."categories" (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        createdAt TIMESTAMPTZ DEFAULT now()
      )`;

    const id = uuidv4();
    try {
      await prisma.$executeRaw`
        INSERT INTO "hardware"."categories" (id, name) VALUES (${id}, ${name})
      `;
    } catch (insertErr: any) {
      // If unique constraint violated, ignore
      const msg = String(insertErr?.message || insertErr);
      if (msg.includes('duplicate') || msg.includes('already exists')) {
        // fallthrough
      } else {
        throw insertErr;
      }
    }

    return NextResponse.json({ success: true, name });
  } catch (err: any) {
    console.error('/api/categories POST error:', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
