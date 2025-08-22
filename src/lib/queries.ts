// src/lib/queries.ts
import { PrismaClient } from "@prisma/client";

/** Prisma singleton để tránh leak khi HMR */
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  g.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

export interface SearchParams {
  // từ khóa
  q?: string;

  // filter
  propertyType?: string;  // "can-ho" | "nha-rieng" | "dat-nen" | "phong-tro" | "all"
  price?: string;         // "min-max" | "min-" | "-max" | "min+"
  area?: string;          // "min-max" | "min-" | "-max"
  has3D?: string;         // "true" | "false"
  bedrooms?: string;      // gte
  bathrooms?: string;     // gte
  direction?: string;     // "dong-nam" ...
  status?: string;        // "available" | "sold"
  purpose?: string;       // "buy" | "rent" | "all"
  project?: string;       // projectSlug
  city?: string;
  district?: string;
  ward?: string;
  legal?: string;         // "so-do" | "so-hong" | "hop-dong-thue"

  // chỉ dùng cho trang /search (mới)
  sort?: "newest" | "oldest" | "priceAsc" | "priceDesc" | "areaAsc" | "areaDesc";
  page?: string | number;
  pageSize?: string | number;
}

/* ---------------- helpers ---------------- */
const toStr = (v: unknown) => (Array.isArray(v) ? v[0] : typeof v === "string" ? v : undefined);
const toNum = (v: unknown) => {
  const s = toStr(v);
  if (s == null || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};
const toBool = (v: unknown) => {
  if (typeof v === "boolean") return v;
  const s = (toStr(v) || "").toLowerCase();
  return s === "true" || s === "1";
};
function parseRange(range?: string) {
  if (!range) return undefined as { gte?: number; lte?: number } | undefined;
  if (range.endsWith("+")) {
    const min = Number(range.slice(0, -1));
    return Number.isFinite(min) ? { gte: min } : undefined;
  }
  if (range.includes("-")) {
    const [minStr, maxStr] = range.split("-");
    const min = minStr ? Number(minStr) : undefined;
    const max = maxStr ? Number(maxStr) : undefined;
    const out: { gte?: number; lte?: number } = {};
    if (Number.isFinite(min!)) out.gte = min!;
    if (Number.isFinite(max!)) out.lte = max!;
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

/** Build chung: where + orderBy (không áp dụng take/skip) */
function buildWhereOrder(filters: SearchParams) {
  const {
    q,
    propertyType, purpose,
    city, district, ward,
    price, area,
    has3D, bedrooms, bathrooms,
    direction, status, legal, project,
    sort,
  } = filters;

  const where: any = {};

  if (propertyType && propertyType !== "all") where.propertyType = propertyType;
  if (purpose && purpose !== "all") where.purpose = purpose;

  if (city) where.city = city;
  if (district) where.district = district;
  if (ward) where.ward = ward;

  const priceRange = parseRange(toStr(price));
  if (priceRange) where.price = priceRange;

  const areaRange = parseRange(toStr(area));
  if (areaRange) where.area = areaRange;

  if (typeof has3D !== "undefined") where.has3D = toBool(has3D);
  const minBed = toNum(bedrooms);
  if (typeof minBed !== "undefined") where.bedrooms = { gte: minBed };
  const minBath = toNum(bathrooms);
  if (typeof minBath !== "undefined") where.bathrooms = { gte: minBath };
  if (direction) where.direction = direction;
  if (status) where.status = status;
  if (legal) where.legal = legal;
  if (project) where.projectSlug = project;

  const keyword = toStr(q)?.trim();
  if (keyword) {
    where.OR = [
      { title:       { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
      { address:     { contains: keyword, mode: "insensitive" } },
      { district:    { contains: keyword, mode: "insensitive" } },
      { city:        { contains: keyword, mode: "insensitive" } },
      // ❌ projectName (không có trong schema)
      // ✅ cho phép tìm theo slug nếu người dùng gõ giống slug
      { projectSlug: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderByMap = {
    newest:    { postedAt: "desc" as const },
    oldest:    { postedAt: "asc"  as const },
    priceAsc:  { price: "asc"     as const },
    priceDesc: { price: "desc"    as const },
    areaAsc:   { area: "asc"      as const },
    areaDesc:  { area: "desc"     as const },
  };
  const orderBy = orderByMap[(sort as keyof typeof orderByMap) || "newest"] ?? orderByMap.newest;

  return { where, orderBy, keyword };
}

/* ---------------- APIs cho trang cũ (giữ nguyên kiểu trả về mảng) ---------------- */
/** GIỮ NGUYÊN cho các trang cũ: trả về mảng Property[] (không phân trang) */
export async function getPropertiesByFilter(filters: SearchParams) {
  const { where, orderBy, keyword } = buildWhereOrder(filters);

  // Nếu có keyword và KHÔNG set filter project cụ thể,
  // mở rộng tìm theo tên dự án -> suy ra slug rồi đưa vào OR.
  if (keyword && !filters.project) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { slug: { contains: keyword, mode: "insensitive" } },
        ],
      },
      select: { slug: true },
    });
    if (projects.length) {
      const slugs = projects.map((p) => p.slug);
      // nếu đã có where.OR, nối thêm; nếu chưa, tạo mới
      where.OR = Array.isArray(where.OR)
        ? [...where.OR, { projectSlug: { in: slugs } }]
        : [{ projectSlug: { in: slugs } }];
    }
  }

  return prisma.property.findMany({ where, orderBy });
}

/* ---------------- APIs mới cho trang /search ---------------- */
export async function getPropertiesByFilterPaged(filters: SearchParams) {
  const { where, orderBy, keyword } = buildWhereOrder(filters);

  // Mở rộng tìm theo tên dự án (như trên)
  if (keyword && !filters.project) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { slug: { contains: keyword, mode: "insensitive" } },
        ],
      },
      select: { slug: true },
    });
    if (projects.length) {
      const slugs = projects.map((p) => p.slug);
      where.OR = Array.isArray(where.OR)
        ? [...where.OR, { projectSlug: { in: slugs } }]
        : [{ projectSlug: { in: slugs } }];
    }
  }

  const page = Math.max(1, toNum(filters.page) ?? 1);
  const pageSize = Math.min(48, Math.max(1, toNum(filters.pageSize) ?? 12));
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.property.findMany({ where, orderBy, skip, take: pageSize }),
    prisma.property.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

/** alias tiện dùng nếu muốn tên “list” rõ ràng */
export async function getPropertiesList(filters: SearchParams) {
  return getPropertiesByFilter(filters);
}

/* ---------------- các hàm khác giữ nguyên ---------------- */
export async function getIndustrialProperties(purpose: "buy" | "rent" = "buy") {
  return prisma.property.findMany({
    where: { propertyType: { in: ["dat-nen", "nha-xuong"] }, purpose },
    orderBy: { postedAt: "desc" },
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({ where: { id } });
}
