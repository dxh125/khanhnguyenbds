import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const ProjectSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  imageUrl: z.string().url().optional().nullable(),
});


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await prisma.project.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = ProjectSchema.parse(body);
    const created = await prisma.project.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
