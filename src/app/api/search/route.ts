import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const country = (searchParams.get("country") ?? "").trim();

  if (!q && !country) {
    return NextResponse.json({ universities: [], courses: [] });
  }

  const [universities, courses] = await Promise.all([
    prisma.university.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { city: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          country ? { country: { slug: country } } : {},
        ],
      },
      include: { country: true },
      take: 10,
      orderBy: [{ rankingGlobal: "asc" }, { name: "asc" }],
    }),
    prisma.course.findMany({
      where: {
        AND: [
          q ? { name: { contains: q, mode: "insensitive" } } : {},
          country ? { university: { country: { slug: country } } } : {},
        ],
      },
      include: { university: { include: { country: true } } },
      take: 10,
      orderBy: [{ tuitionFeeUsd: "asc" }, { name: "asc" }],
    }),
  ]);

  return NextResponse.json({ universities, courses });
}

