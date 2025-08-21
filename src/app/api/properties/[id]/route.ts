// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // dùng prisma từ lib

// GET: Lấy chi tiết 1 property
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next 15: Promise
) {
  const { id } = await params;

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json({ error: "Không tìm thấy dữ liệu" }, { status: 404 });
    }
    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết property:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT: Cập nhật 1 property
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await req.json();
    const updated = await prisma.property.update({ where: { id }, data });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật property:", error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

// DELETE: Xoá 1 property
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ message: "Đã xoá thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xoá property:", error);
    return NextResponse.json({ error: "Không thể xoá" }, { status: 500 });
  }
}

// (tuỳ chọn) Nếu bạn muốn chắc chắn không bị static hoá:
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
