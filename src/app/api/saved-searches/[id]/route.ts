// app/api/saved-searches/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObjectId = (s: string) => /^[a-f\d]{24}$/i.test(s);

const UpdateSchema = z.object({
  name: z.string().trim().min(1).optional().nullable(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "area-asc", "area-desc"])
    .optional()
    .nullable(),
  // Cho phép client gửi bất kỳ JSON, hoặc null (ta sẽ xử lý thành {} hoặc bỏ qua)
  filters: z.unknown().optional().nullable(),
});

// GET /api/saved-searches/[id]
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  const ss = await prisma.savedSearch.findUnique({ where: { id } });
  if (!ss) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(ss);
}

// PUT /api/saved-searches/[id]
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = UpdateSchema.parse(body);

    const data: Prisma.SavedSearchUpdateInput = {};

    if (typeof parsed.name !== "undefined") {
      data.name = parsed.name; // có thể là string hoặc null
    }
    if (typeof parsed.sort !== "undefined") {
      data.sort = parsed.sort as any; // type là string? trong schema -> hợp lệ
    }
    if ("filters" in parsed) {
      // ❗ Tránh set null vì type không cho phép.
      // Nếu client muốn "xoá", dùng {} làm giá trị rỗng.
      if (parsed.filters === null) {
        data.filters = {} as Prisma.InputJsonValue;
      } else if (typeof parsed.filters !== "undefined") {
        data.filters = parsed.filters as Prisma.InputJsonValue;
      }
      // Nếu muốn "không đổi", đừng gán gì cả (để undefined).
    }

    const updated = await prisma.savedSearch.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json(
        { error: e.issues?.[0]?.message || "Payload không hợp lệ" },
        { status: 400 }
      );
    }
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    console.error("Update saved-search error:", e);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

// DELETE /api/saved-searches/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    await prisma.savedSearch.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }
    console.error("Delete saved-search error:", e);
    return NextResponse.json({ error: "Không thể xoá" }, { status: 500 });
  }
}
