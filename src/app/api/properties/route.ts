// src/app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PROPERTY_TYPES, PURPOSES, STATUSES, DIRECTIONS, LEGALS, valuesOf } from "@/constants/bdsOptions";


// Bắt Next không cache tĩnh & đảm bảo chạy Node runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  address: z.string().min(3),

  ward: z.string().optional().nullable(),     // lưu slug phường
  district: z.string().optional().nullable(), // lưu slug quận
  city: z.string().optional().nullable(),     // lưu slug tỉnh/thành

  propertyType: z.enum(valuesOf(PROPERTY_TYPES)),
  purpose: z.enum(valuesOf(PURPOSES)),
  status: z.enum(valuesOf(STATUSES)),

  bedrooms: z.coerce.number().int().optional().nullable(),
  bathrooms: z.coerce.number().int().optional().nullable(),
  floors: z.coerce.number().int().optional().nullable(),

  legal: z.enum(valuesOf(LEGALS)).optional().nullable(),
  direction: z.enum(valuesOf(DIRECTIONS)).optional().nullable(),

  highlights: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).min(1),

  userId: z.string().optional().nullable(),
  projectSlug: z.string().optional().nullable(), // 👈 slug dự án
});

// GET: trả danh sách property mới nhất trước
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { postedAt: "desc" },
    });
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bất động sản:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu" },
      { status: 500 }
    );
  }
}

// POST: tạo property mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = PropertySchema.parse(body);

    const created = await prisma.property.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("Create property error:", err);
    const message =
      err?.issues?.[0]?.message || err?.message || "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
