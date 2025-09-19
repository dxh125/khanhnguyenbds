// src/app/api/saved-searches/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getUserIdFromRequest } from "@/lib/getUserIdFromRequest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SavePayload = z.object({
  name: z.string().trim().optional(),
  filters: z.record(z.any()),       // lưu raw filter object
  sort: z.string().trim().optional()
});

// GET: list theo user
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

// POST: tạo saved search
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = SavePayload.parse(body);

    const created = await prisma.savedSearch.create({
      data: {
        userId,
        name: data.name,
        filters: data.filters,
        sort: data.sort,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.issues?.[0]?.message || err?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
