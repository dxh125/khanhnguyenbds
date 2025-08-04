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
  purpose?: string; // "buy" | "rent"
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

  const properties = await prisma.property.findMany({
    where,
    orderBy: { postedAt: 'desc' },
  });

  return properties;
}
