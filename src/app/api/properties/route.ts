import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { postedAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu property:", error);
    return NextResponse.json({ error: "Không thể lấy dữ liệu" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // ✅ Đảm bảo đóng kết nối
  }
}
