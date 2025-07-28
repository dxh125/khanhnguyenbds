import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy chi tiết 1 property
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json({ error: "Không tìm thấy dữ liệu" }, { status: 404 });
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết property:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Cập nhật 1 property
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const data = await req.json();
    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật property:", error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Xoá 1 property
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Đã xoá thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xoá property:", error);
    return NextResponse.json({ error: "Không thể xoá" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
