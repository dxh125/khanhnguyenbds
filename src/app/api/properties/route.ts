// src/app/api/properties/route.ts
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

// Bắt Next không cache tĩnh & đảm bảo chạy Node runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Chuẩn hoá "purpose" nếu client lỡ gửi nhãn tiếng Việt:
 * "ban"/"bán"  -> "buy"
 * "cho-thue"/"cho thuê"/"thue" -> "rent"
 */
const PurposeEnum = z.enum(valuesOf(PURPOSES));
const PurposeSchema = z.preprocess((v) => {
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "ban" || s === "bán") return "buy";
    if (s === "cho-thue" || s === "cho thuê" || s === "thue" || s === "thuê") return "rent";
  }
  return v;
}, PurposeEnum);

/** Thông số kỹ thuật cho BĐS công nghiệp (tuỳ chọn) */
const SpecsSchema = z
  .object({
    powerKva: z.coerce.number().positive().optional(),       // Điện 3 pha (kVA)
    floorLoad: z.coerce.number().positive().optional(),      // Tải sàn (tấn/m²)
    clearHeight: z.coerce.number().positive().optional(),    // Cao thông thuỷ (m)
    dockDoors: z.coerce.number().int().min(0).optional(),    // Số cửa/dock
    roadWidth: z.coerce.number().positive().optional(),      // Lộ giới (m)
    officeRatio: z.coerce.number().min(0).max(100).optional()// % diện tích văn phòng
  })
  .partial()
  .strict();

const PropertySchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  address: z.string().trim().min(3),

  // Lưu slug vị trí
  ward: z.string().trim().optional().nullable(),
  district: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),

  propertyType: z.enum(valuesOf(PROPERTY_TYPES)),
  purpose: PurposeSchema, // dùng schema đã chuẩn hoá ở trên
  status: z.enum(valuesOf(STATUSES)),

  bedrooms: z.coerce.number().int().optional().nullable(),
  bathrooms: z.coerce.number().int().optional().nullable(),
  floors: z.coerce.number().int().optional().nullable(),

  legal: z.enum(valuesOf(LEGALS)).optional().nullable(),
  direction: z.enum(valuesOf(DIRECTIONS)).optional().nullable(),

  highlights: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).min(1),

  userId: z.string().trim().optional().nullable(),
  projectSlug: z.string().trim().optional().nullable(), // slug dự án

  // 👇 Thông số công nghiệp (chỉ gửi khi cần)
  specs: SpecsSchema.optional(),
});

// GET: trả danh sách property mới nhất trước
// GET: trả danh sách property mới nhất trước, có thể lọc theo ?userId=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const properties = await prisma.property.findMany({
      where: userId ? { userId } : undefined,
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
    const raw = await req.json();

    // Lấy userId fallback từ header (nếu client chưa gửi trong body)
    const headerUserId = req.headers.get("x-user-id") || undefined;

    // Helper: chuyển "" -> undefined cho các field optional
    const emptyToUndef = (v: any) => (v === "" || v === null ? undefined : v);

    // Chuẩn hoá payload trước khi parse
    const merged = {
      ...raw,

      // Ưu tiên userId từ body; nếu thiếu thì dùng header
      userId: raw.userId ?? headerUserId ?? undefined,

      // Chuẩn hoá các optional string/slugs
      ward: emptyToUndef(raw.ward),
      district: emptyToUndef(raw.district),
      city: emptyToUndef(raw.city),
      legal: emptyToUndef(raw.legal),
      direction: emptyToUndef(raw.direction),
      projectSlug: emptyToUndef(raw.projectSlug),

      // Các số optional (client thường đã Number() rồi, nhưng ta vẫn chấp nhận rỗng)
      bedrooms: emptyToUndef(raw.bedrooms),
      bathrooms: emptyToUndef(raw.bathrooms),
      floors: emptyToUndef(raw.floors),

      // Highlights: đảm bảo là mảng string hoặc để schema xử lý default([])
      highlights: Array.isArray(raw.highlights) ? raw.highlights : undefined,

      // Nếu client có gửi kèm specs (cho công nghiệp) mà model chưa có field này,
      // Zod (object mặc định strip unknown) sẽ tự loại bỏ — không cần làm gì thêm.
    };

    // Validate & chuẩn hoá theo schema hiện có
    const data = PropertySchema.parse(merged);

    // Tạo bản ghi
    const created = await prisma.property.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("Create property error:", err);
    // ZodError: ưu tiên trả message rõ ràng
    const message =
      err?.issues?.[0]?.message || err?.message || "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}