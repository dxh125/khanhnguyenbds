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
  project?: string; // "buy" | "rent"
}

export async function getPropertiesByFilter(filters: SearchParams) {
  const {
    propertyType,
    price,
    area,
    has3D,
    bedrooms,
    bathrooms,
    direction,
    status,
    purpose,
    project,
  } = filters;

  const where: any = {};

  if (propertyType) where.propertyType = propertyType;
  if (purpose) where.purpose = purpose;

  if (price) {
    const [min, max] = price.split('-').map(Number);
    where.price = { gte: min, lte: max };
  }

  if (area) {
    const [min, max] = area.split('-').map(Number);
    where.area = { gte: min, lte: max };
  }

  if (has3D) {
    where.has3D = has3D === 'true';
  }

  if (bedrooms) {
    where.bedrooms = Number(bedrooms);
  }

  if (bathrooms) {
    where.bathrooms = Number(bathrooms);
  }

  if (direction) {
    where.direction = direction;
  }

  if (status) {
    where.status = status;
  }
  if (filters.project) {
    where.projectSlug = filters.project;
  }
  const properties = await prisma.property.findMany({
    where,
    orderBy: { postedAt: 'desc' },
  });

  return properties;
}

export async function getIndustrialProperties(purpose: "buy" | "rent" = "buy") {
  return await prisma.property.findMany({
    where: {
      propertyType: {
        in: ["dat-nen", "nha-xuong"], // ✅ Dùng slug để khớp database
      },
      purpose,
    },
    orderBy: {
      postedAt: "desc",
    },
  });
}
export async function getAllProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectBySlug(slug: string) {
  return await prisma.project.findUnique({
    where: { slug },
  });
}


