// app/api/saved-searches/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (s: string) => /^[a-f\d]{24}$/i.test(s);

// Nhận filters dạng bất kỳ, không cần JsonSchema phức tạp
const UpdateSchema = z.object({
  name: z.string().trim().min(1).optional().nullable(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "area-asc", "area-desc"])
    .optional()
    .nullable(),
  filters: z.any().optional().nullable(),
});

// GET /api/saved-searches/[id]
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id") || "";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  const ss = await prisma.savedSearch.findFirst({ where: { id, userId } });
  if (!ss) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(ss, { status: 200 });
}

// PUT /api/saved-searches/[id]
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id") || "";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const parsed = UpdateSchema.parse(await req.json());

    const data: Prisma.SavedSearchUpdateInput = {};
    if (typeof parsed.name !== "undefined") data.name = parsed.name;
    if (typeof parsed.sort !== "undefined" && parsed.sort !== null) data.sort = parsed.sort;

    if (typeof parsed.filters !== "undefined") {
      // Không set null vào Prisma — dùng {} nếu muốn “xoá”
      data.filters =
        parsed.filters === null
          ? ({} as Prisma.InputJsonValue)
          : (parsed.filters as Prisma.InputJsonValue);
    }

    const result = await prisma.savedSearch.updateMany({ where: { id, userId }, data });
    if (result.count === 0) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    const updated = await prisma.savedSearch.findFirst({ where: { id, userId } });
    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json(
        { error: e.issues?.[0]?.message || "Payload không hợp lệ" },
        { status: 400 }
      );
    }
    console.error("Update saved-search error:", e);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

// DELETE /api/saved-searches/[id]
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id") || "";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const result = await prisma.savedSearch.deleteMany({ where: { id, userId } });
    if (result.count === 0) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("Delete saved-search error:", e);
    return NextResponse.json({ error: "Không thể xoá" }, { status: 500 });
  }
}
