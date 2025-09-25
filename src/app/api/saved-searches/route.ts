// app/api/saved-searches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Nhận filters dạng bất kỳ (tránh dùng z.record ở Zod v4 classic)
const SaveSchema = z.object({
  name: z.string().trim().optional().nullable(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "area-asc", "area-desc"])
    .optional()
    .nullable(),
  filters: z.any().optional().nullable(),
});

// GET /api/saved-searches  -> trả danh sách theo userId
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || "";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const list = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list, { status: 200 });
  } catch (e) {
    console.error("List saved-searches error:", e);
    return NextResponse.json({ error: "Không thể lấy dữ liệu" }, { status: 500 });
  }
}

// POST /api/saved-searches  -> tạo mới
export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || "";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = SaveSchema.parse(body);

    // Chuẩn hoá filters thành Prisma.InputJsonValue (không để null)
    let filtersVal: Prisma.InputJsonValue = {};
    if (typeof parsed.filters !== "undefined" && parsed.filters !== null) {
      const f = parsed.filters;
      if (typeof f === "string") {
        try {
          filtersVal = JSON.parse(f) as Prisma.InputJsonValue;
        } catch {
          // nếu client gửi string không phải JSON -> lưu string thô
          filtersVal = f as unknown as Prisma.InputJsonValue;
        }
      } else {
        filtersVal = f as Prisma.InputJsonValue;
      }
    }

    const created = await prisma.savedSearch.create({
      data: {
        userId,
        name: parsed.name ?? undefined,
        sort: parsed.sort ?? undefined,
        filters: filtersVal,
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
