import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await prisma.project.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(projects);
}
