// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Dùng singleton trong dev để tránh tạo quá nhiều connection
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query", "error", "warn"], // bật khi cần debug
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
