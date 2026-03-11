// src/app/api/saved-searches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";

export const runtime = "nodejs";       // admin SDK cần Node runtime
export const dynamic = "force-dynamic";

const CreateSchema = z.object({
  name: z.string().trim().min(1),
  sort: z.enum(["newest", "price-asc", "price-desc", "area-asc", "area-desc"]).default("newest"),
  filters: z.any().default({}),
});

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req); // ✔️ lấy uid từ Bearer token
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = CreateSchema.parse(await req.json());

    const created = await prisma.savedSearch.create({
      data: {
        userId,
        name: body.name,
        sort: body.sort,
        filters: body.filters as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json(
        { error: e.issues?.[0]?.message || "Payload không hợp lệ" },
        { status: 400 }
      );
    }
    console.error("Create saved-search error:", e);
    return NextResponse.json({ error: "Không thể tạo" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100, // tuỳ bạn
  });

  return NextResponse.json(list, { status: 200 });
}
