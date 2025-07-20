import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { postedAt: "desc" },
  });

  return NextResponse.json(properties);
}
