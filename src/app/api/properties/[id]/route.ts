import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Không tìm thấy dữ liệu" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết property:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
