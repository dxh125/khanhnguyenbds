// src/app/api/saved-searches/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";

export const runtime = "nodejs";       // ⚠️ Admin SDK cần Node.js runtime
export const dynamic = "force-dynamic";

const UpdateSchema = z.object({
  name: z.string().trim().min(1).optional().nullable(),
  sort: z.enum(["newest", "price-asc", "price-desc", "area-asc", "area-desc"]).optional().nullable(),
  filters: z.any().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const ss = await prisma.savedSearch.findFirst({ where: { id, userId } });
  if (!ss) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(ss);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  try {
    const parsed = UpdateSchema.parse(await req.json());
    const data: Prisma.SavedSearchUpdateInput = {};
    if (typeof parsed.name !== "undefined") data.name = parsed.name;
    if (typeof parsed.sort !== "undefined" && parsed.sort !== null) data.sort = parsed.sort;
    if (typeof parsed.filters !== "undefined") {
      data.filters = parsed.filters === null ? ({} as Prisma.InputJsonValue) : (parsed.filters as Prisma.InputJsonValue);
    }

    const result = await prisma.savedSearch.updateMany({ where: { id, userId }, data });
    if (result.count === 0) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

    const updated = await prisma.savedSearch.findFirst({ where: { id, userId } });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ error: e.issues?.[0]?.message || "Payload không hợp lệ" }, { status: 400 });
    }
    console.error("Update saved-search error:", e);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  try {
    const result = await prisma.savedSearch.deleteMany({ where: { id, userId } });
    if (result.count === 0) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Delete saved-search error:", e);
    return NextResponse.json({ error: "Không thể xoá" }, { status: 500 });
  }
}
