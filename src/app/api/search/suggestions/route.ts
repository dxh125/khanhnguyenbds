// app/api/search/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("q") || "").trim();
    if (!raw) return NextResponse.json({ suggestions: [] });

    // tách token đơn giản
    const tokens = raw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    // helper tạo OR-clause cho 1 token
    const orForToken = (tk: string): Prisma.PropertyWhereInput => ({
      OR: [
        { title:   { contains: tk, mode: Prisma.QueryMode.insensitive } },
        { address: { contains: tk, mode: Prisma.QueryMode.insensitive } },
        { district:{ contains: tk, mode: Prisma.QueryMode.insensitive } },
        { city:    { contains: tk, mode: Prisma.QueryMode.insensitive } },
      ],
    });

    // annotate rõ ràng kiểu where để TS không phàn nàn
    const where: Prisma.PropertyWhereInput =
      tokens.length <= 1
        ? orForToken(raw)
        : { AND: tokens.map(orForToken) };

    const suggestions = await prisma.property.findMany({
      where,
      select: {
        id: true,
        title: true,
        address: true,
        district: true,
        city: true,
        propertyType: true,
      },
      orderBy: { postedAt: "desc" },
      take: 8,
    });

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error("suggestions error", e);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
