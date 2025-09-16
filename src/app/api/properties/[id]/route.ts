// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  PROPERTY_TYPES,
  PURPOSES,
  STATUSES,
  DIRECTIONS,
  LEGALS,
  valuesOf,
} from "@/constants/bdsOptions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ✅ Validate Mongo ObjectId (24 hex)
const isObjectId = (s: string) => /^[a-f\d]{24}$/i.test(s);

// ✅ Chuẩn hoá purpose từ nhãn TV sang slug hệ thống
const PurposeEnum = z.enum(valuesOf(PURPOSES));
const PurposeSchema = z.preprocess((v) => {
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "ban" || s === "bán") return "buy";
    if (s === "cho-thue" || s === "cho thuê" || s === "thue" || s === "thuê") return "rent";
  }
  return v;
}, PurposeEnum);

// ✅ Thông số công nghiệp (tuỳ chọn)
const SpecsSchema = z
  .object({
    powerKva: z.coerce.number().positive().optional(),
    floorLoad: z.coerce.number().positive().optional(),
    clearHeight: z.coerce.number().positive().optional(),
    dockDoors: z.coerce.number().int().min(0).optional(),
    roadWidth: z.coerce.number().positive().optional(),
    officeRatio: z.coerce.number().min(0).max(100).optional(),
  })
  .partial()
  .strict();

// ✅ Schema cập nhật (partial)
const UpdateSchema = z
  .object({
    title: z.string().trim().min(3).optional(),
    description: z.string().trim().min(10).optional(),
    price: z.coerce.number().positive().optional(),
    area: z.coerce.number().positive().optional(),
    address: z.string().trim().min(3).optional(),

    ward: z.string().trim().optional().nullable(),
    district: z.string().trim().optional().nullable(),
    city: z.string().trim().optional().nullable(),

    propertyType: z.enum(valuesOf(PROPERTY_TYPES)).optional(),
    purpose: PurposeSchema.optional(),
    status: z.enum(valuesOf(STATUSES)).optional(),

    bedrooms: z.coerce.number().int().optional().nullable(),
    bathrooms: z.coerce.number().int().optional().nullable(),
    floors: z.coerce.number().int().optional().nullable(),

    legal: z.enum(valuesOf(LEGALS)).optional().nullable(),
    direction: z.enum(valuesOf(DIRECTIONS)).optional().nullable(),

    highlights: z.array(z.string()).optional(),
    images: z.array(z.string().url()).optional(),

    projectSlug: z.string().trim().optional().nullable(),
    userId: z.string().trim().optional().nullable(), // (tuỳ chọn) cho phép đổi chủ

    specs: SpecsSchema.optional(),
  })
  .strict();

// 👇 Kiểu context Next 15: params là Promise
type Ctx = { params: Promise<{ id: string }> };

// GET: Lấy chi tiết 1 property
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!id || !isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json({ error: "Không tìm thấy dữ liệu" }, { status: 404 });
    }
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết property:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT: Cập nhật 1 property
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!id || !isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const json = await req.json();
    const data = UpdateSchema.parse(json);

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: "Payload trống" }, { status: 400 });
    }

    // (Khuyến nghị) Kiểm tra quyền: chỉ cho owner cập nhật
    // - Lấy userId từ token (nếu bạn đã triển khai verify trên server)
    // - So sánh với property.userId rồi mới cho update

    const updated = await prisma.property.update({ where: { id }, data });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy tin để cập nhật" }, { status: 404 });
    }
    console.error("Lỗi khi cập nhật property:", error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

// DELETE: Xoá 1 property
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!id || !isObjectId(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    // (Khuyến nghị) Kiểm tra quyền: chỉ cho owner xoá
    // - Lấy userId từ token (nếu đã verify)
    // - So sánh với property.userId

    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ message: "Đã xoá thành công" }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy tin" }, { status: 404 });
    }
    console.error("Lỗi khi xoá property:", error);
    return NextResponse.json({ error: "Không thể xoá" }, { status: 500 });
  }
}
