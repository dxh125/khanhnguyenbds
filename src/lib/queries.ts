// src/lib/queries.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface SearchParams {
  propertyType?: string;
  price?: string;      // "min-max" | "min-" | "-max" | "min+"
  area?: string;       // "min-max" | "min-"
  has3D?: string;      // "true" | "false"
  bedrooms?: string;   // số
  bathrooms?: string;  // số
  direction?: string;  // "dong-nam" ...
  status?: string;     // "available" | "sold"
  purpose?: string;    // "buy" | "rent"
  project?: string;    // slug dự án
  city?: string;
  district?: string;
  ward?: string;
  legal?: string;      // "so-do" | "so-hong" | "hop-dong-thue"
}

export async function getPropertiesByFilter(filters: SearchParams) {
  const {
    propertyType, price, area, has3D, bedrooms, bathrooms,
    direction, status, purpose, project, city, district, ward, legal,
  } = filters;

  const where: any = {};

  // 🔎 loại hình + mục đích
  if (propertyType && propertyType !== "all") where.propertyType = propertyType;
  if (purpose && purpose !== "all") where.purpose = purpose;

  // 🔎 địa lý (slug)
  if (city) where.city = city;
  if (district) where.district = district;
  if (ward) where.ward = ward;

  // 🔎 giá: "min-max" | "min-" | "-max" | "min+"
  if (price) {
    if (price.endsWith("+")) {
      const min = Number(price.slice(0, -1));
      if (!Number.isNaN(min)) where.price = { gte: min };
    } else if (price.includes("-")) {
      const [minStr, maxStr] = price.split("-");
      const min = minStr ? Number(minStr) : undefined;
      const max = maxStr ? Number(maxStr) : undefined;
      if (min != null || max != null) {
        where.price = {};
        if (min != null && !Number.isNaN(min)) where.price.gte = min;
        if (max != null && !Number.isNaN(max)) where.price.lte = max;
      }
    }
  }

  // 🔎 diện tích: "min-max" | "min-" | "-max"
  if (area && area.includes("-")) {
    const [minStr, maxStr] = area.split("-");
    const min = minStr ? Number(minStr) : undefined;
    const max = maxStr ? Number(maxStr) : undefined;
    if (min != null || max != null) {
      where.area = {};
      if (min != null && !Number.isNaN(min)) where.area.gte = min;
      if (max != null && !Number.isNaN(max)) where.area.lte = max;
    }
  }

  // 🔎 tuỳ chọn khác
  if (has3D) where.has3D = has3D === "true";
  if (bedrooms) where.bedrooms = { gte: Number(bedrooms) };
  if (bathrooms) where.bathrooms = { gte: Number(bathrooms) };
  if (direction) where.direction = direction;
  if (status) where.status = status;
  if (legal) where.legal = legal;
  if (project) where.projectSlug = project;

  // DEBUG (tuỳ): kiểm tra filters nhận vào
  // console.log("[filters]", filters);
  // console.dir(where, { depth: null });

  return prisma.property.findMany({
    where,
    orderBy: { postedAt: "desc" },
  });
}

export async function getIndustrialProperties(purpose: "buy" | "rent" = "buy") {
  return prisma.property.findMany({
    where: { propertyType: { in: ["dat-nen", "nha-xuong"] }, purpose },
    orderBy: { postedAt: "desc" },
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}
// src/lib/queries.ts


export async function getPropertyById(id: string) {
  return prisma.property.findUnique({ where: { id } });
}