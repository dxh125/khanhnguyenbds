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
  project?: string; // slug dự án
}

export async function getPropertiesByFilter(filters: SearchParams) {
  const {
    propertyType, price, area, has3D, bedrooms, bathrooms,
    direction, status, purpose, project,
  } = filters;

  const where: any = {};
  if (propertyType && propertyType !== 'all') where.propertyType = propertyType;
  if (purpose && purpose !== 'all') where.purpose = purpose;

  if (price) {
    const [min, max] = price.split('-').map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) where.price = { gte: min, lte: max };
  }
  if (area) {
    const [min, max] = area.split('-').map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) where.area = { gte: min, lte: max };
  }

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

// ✅ Thêm/đảm bảo 2 hàm dưới được export
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
