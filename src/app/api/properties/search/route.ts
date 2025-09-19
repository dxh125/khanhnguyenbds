// app/api/properties/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// helpers
const num = (v: string | null) => {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// parse "range" dạng "min-max" hoặc "min+" hoặc "+max"
function parseRange(v?: string | null): { min?: number; max?: number } {
  if (!v) return {};
  const s = v.replace(/\s/g, "");
  const m = /^(\d+)-(\d+)$/.exec(s);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };
  const m2 = /^(\d+)\+$/.exec(s);
  if (m2) return { min: Number(m2[1]) };
  const m3 = /^\+(\d+)$/.exec(s);
  if (m3) return { max: Number(m3[1]) };
  // fallback: nếu là số thuần
  const n = Number(s);
  return Number.isFinite(n) ? { min: n } : {};
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ——— Query cơ bản
    const q = (searchParams.get("q") || "").trim();
    const purpose = searchParams.get("purpose") || undefined;        // "buy" | "rent"
    const propertyType = searchParams.get("propertyType") || undefined;

    const city = searchParams.get("city") || undefined;
    const district = searchParams.get("district") || undefined;
    const ward = searchParams.get("ward") || undefined;

    // ——— Price/Area: hỗ trợ 2 kiểu: min/max riêng hoặc chuỗi "min-max"
    const priceMin = num(searchParams.get("minPrice")) ?? parseRange(searchParams.get("price")).min;
    const priceMax = num(searchParams.get("maxPrice")) ?? parseRange(searchParams.get("price")).max;
    const areaMin  = num(searchParams.get("minArea"))  ?? parseRange(searchParams.get("area")).min;
    const areaMax  = num(searchParams.get("maxArea"))  ?? parseRange(searchParams.get("area")).max;

    const bedrooms = num(searchParams.get("bedrooms"));
    const bathrooms = num(searchParams.get("bathrooms"));
    const legal = searchParams.get("legal") || undefined;
    const direction = searchParams.get("direction") || undefined;
    const status = searchParams.get("status") || undefined;
    const projectSlug = searchParams.get("project") || undefined;

    // lọc theo user (khi vào trang "tin của tôi")
    const userId = searchParams.get("userId") || undefined;

    // ——— Sort & Pagination
    const sort = (searchParams.get("sort") || "newest").toLowerCase();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") || 12)));
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // ——— where Prisma
    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ];
    }
    if (purpose) where.purpose = purpose;
    if (propertyType) where.propertyType = propertyType;

    if (city) where.city = city;
    if (district) where.district = district;
    if (ward) where.ward = ward;

    if (typeof priceMin === "number" || typeof priceMax === "number") {
      where.price = {};
      if (typeof priceMin === "number") where.price.gte = priceMin;
      if (typeof priceMax === "number") where.price.lte = priceMax;
    }
    if (typeof areaMin === "number" || typeof areaMax === "number") {
      where.area = {};
      if (typeof areaMin === "number") where.area.gte = areaMin;
      if (typeof areaMax === "number") where.area.lte = areaMax;
    }

    if (typeof bedrooms === "number") where.bedrooms = { gte: bedrooms };
    if (typeof bathrooms === "number") where.bathrooms = { gte: bathrooms };
    if (legal) where.legal = legal;
    if (direction) where.direction = direction;
    if (status) where.status = status;
    if (projectSlug) where.projectSlug = projectSlug;
    if (userId) where.userId = userId;

    // ——— orderBy
    let orderBy: any = { postedAt: "desc" as const };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "area-asc") orderBy = { area: "asc" };
    else if (sort === "area-desc") orderBy = { area: "desc" };
    // else: newest

    const [total, items] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const hasMore = skip + items.length < total;

    return NextResponse.json({
      items,
      page,
      pageSize: take,
      total,
      hasMore,
      sort,
      filters: {
        q,
        purpose,
        propertyType,
        city, district, ward,
        priceMin, priceMax,
        areaMin, areaMax,
        bedrooms, bathrooms,
        legal, direction, status, projectSlug,
        userId,
      },
    });
  } catch (e) {
    console.error("properties/search error", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
