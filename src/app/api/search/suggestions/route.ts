import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) return NextResponse.json({ suggestions: [] });

    // Gợi ý theo tiêu đề + địa chỉ, tối giản cho Mongo
    const suggestions = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
          { district: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true, address: true, district: true, city: true, propertyType: true },
      take: 8,
    });

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error("suggestions error", e);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
