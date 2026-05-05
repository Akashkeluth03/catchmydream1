import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      include: {
        country: { select: { name: true } },
        accommodations: true,
        jobs: true,
        courses: true,
      },
      orderBy: { rankingGlobal: 'asc' },
    });

    return NextResponse.json(universities);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}
