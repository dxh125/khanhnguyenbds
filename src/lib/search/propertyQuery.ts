// src/lib/search/propertyQuery.ts
import { z } from "zod";
import { INDUSTRIAL_TYPES, PURPOSES, PROPERTY_TYPES, STATUSES, LEGALS, DIRECTIONS, valuesOf } from "@/constants/bdsOptions";

export const FilterSchema = z.object({
  q: z.string().trim().optional(),
  purpose: z.enum(valuesOf(PURPOSES)).optional(),                    // buy|rent
  propertyType: z.string().optional(),                               // "can-ho" hoặc "can-ho,nha-rieng"
  city: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  projectSlug: z.string().optional(),

  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),

  minBedrooms: z.coerce.number().int().nonnegative().optional(),
  minBathrooms: z.coerce.number().int().nonnegative().optional(),
  minFloors: z.coerce.number().int().nonnegative().optional(),

  legal: z.enum(valuesOf(LEGALS)).optional(),
  direction: z.enum(valuesOf(DIRECTIONS)).optional(),
  status: z.enum(valuesOf(STATUSES)).optional(),

  // lọc công nghiệp: industrial=1 → chỉ lấy các PROPERTY_TYPES thuộc INDUSTRIAL_TYPES
  industrial: z
    .union([z.string().transform(s => s === "1" || s === "true"), z.boolean()])
    .optional(),

  sort: z.enum([
    "newest", "price-asc", "price-desc", "area-asc", "area-desc",
  ]).default("newest"),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export type ParsedFilters = z.infer<typeof FilterSchema>;

export function buildWhere(filters: ParsedFilters) {
  const where: any = {};

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" as any } },
      { description: { contains: filters.q, mode: "insensitive" as any } },
      { address: { contains: filters.q, mode: "insensitive" as any } },
    ];
  }
  if (filters.purpose) where.purpose = filters.purpose;
  if (filters.city) where.city = filters.city;
  if (filters.district) where.district = filters.district;
  if (filters.ward) where.ward = filters.ward;
  if (filters.projectSlug) where.projectSlug = filters.projectSlug;
  if (filters.status) where.status = filters.status;
  if (filters.legal) where.legal = filters.legal;
  if (filters.direction) where.direction = filters.direction;

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }
  if (filters.minArea || filters.maxArea) {
    where.area = {};
    if (filters.minArea) where.area.gte = filters.minArea;
    if (filters.maxArea) where.area.lte = filters.maxArea;
  }
  if (filters.minBedrooms) where.bedrooms = { gte: filters.minBedrooms };
  if (filters.minBathrooms) where.bathrooms = { gte: filters.minBathrooms };
  if (filters.minFloors) where.floors = { gte: filters.minFloors };

  // propertyType: một hoặc danh sách
  if (filters.propertyType) {
    const arr = filters.propertyType.split(",").map(s => s.trim()).filter(Boolean);
    if (arr.length === 1) where.propertyType = arr[0];
    else if (arr.length > 1) where.propertyType = { in: arr };
  }

  // industrial=1 → filter theo nhóm loại công nghiệp
  if (filters.industrial) {
    const set = new Set(INDUSTRIAL_TYPES as readonly string[]);
    where.propertyType = where.propertyType
      ? (typeof where.propertyType === "string"
          ? (set.has(where.propertyType) ? where.propertyType : "__NO_MATCH__")
          : { in: (where.propertyType.in as string[]).filter(v => set.has(v)) }
        )
      : { in: Array.from(set) };
  }

  return where;
}

export function buildOrderBy(sort: ParsedFilters["sort"]) {
  switch (sort) {
    case "price-asc":  return [{ price: "asc" }];
    case "price-desc": return [{ price: "desc" }];
    case "area-asc":   return [{ area: "asc" }];
    case "area-desc":  return [{ area: "desc" }];
    case "newest":
    default:           return [{ postedAt: "desc" }];
  }
}
