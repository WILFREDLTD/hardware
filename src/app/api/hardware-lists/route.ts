import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const lists = await prisma.hardwareList.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(lists)
  } catch (err) {
    console.error('/api/hardware-lists GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch hardware lists' }, { status: 500 })
  }
}
