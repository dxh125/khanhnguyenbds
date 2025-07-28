import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { postedAt: "desc" }, // sắp xếp mới nhất lên đầu
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bất động sản:", error);
    return NextResponse.json({ error: "Không thể lấy dữ liệu" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // đảm bảo đóng kết nối Prisma
  }
}
