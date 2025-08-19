// src/lib/queries.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface SearchParams {
  propertyType?: string;
  price?: string;
  area?: string;
  has3D?: string;
  bedrooms?: string;
  bathrooms?: string;
  direction?: string;
  status?: string;
  purpose?: string;
  project?: string;   // slug dự án
  city?: string;      // slug thành phố
  district?: string;  // slug quận/huyện
  ward?: string;      // slug phường/xã
}

export async function getPropertiesByFilter(filters: SearchParams) {
  const {
    propertyType, price, area, has3D, bedrooms, bathrooms,
    direction, status, purpose, project, city, district, ward
  } = filters;

  const where: any = {};

  // 🔎 loại hình + mục đích
  if (propertyType && propertyType !== 'all') where.propertyType = propertyType;
  if (purpose && purpose !== 'all') where.purpose = purpose;

  // 🔎 tỉnh/thành, quận/huyện, phường/xã (slug)
  if (city) where.city = city;
  if (district) where.district = district;
  if (ward) where.ward = ward;

  // 🔎 khoảng giá
  if (price) {
    const [min, max] = price.split('-').map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      where.price = { gte: min, lte: max };
    }
  }

  // 🔎 diện tích
  // ... trong getPropertiesByFilter
  // 🔎 diện tích
  if (area) {
    if (area.includes("-")) {
      const [minStr, maxStr] = area.split("-");
      const min = minStr ? Number(minStr) : undefined;
      const max = maxStr ? Number(maxStr) : undefined;

      if (min != null || max != null) {
        where.area = {};
        if (min != null && !Number.isNaN(min)) where.area.gte = min;
        if (max != null && !Number.isNaN(max)) where.area.lte = max;
      }
    } else {
      // nếu value không hợp lệ thì bỏ qua
    }
  }


  // 🔎 các option khác
  if (has3D) where.has3D = has3D === 'true';
  if (bedrooms) where.bedrooms = Number(bedrooms);
  if (bathrooms) where.bathrooms = Number(bathrooms);
  if (direction) where.direction = direction;
  if (status) where.status = status;
  if (project) where.projectSlug = project;

  return prisma.property.findMany({
    where,
    orderBy: { postedAt: 'desc' },
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
