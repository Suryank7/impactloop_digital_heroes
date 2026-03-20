import { PrismaClient } from "@prisma/client";

// During build-time on Vercel, DATABASE_URL might be missing, causing a crash.
// We provide a fallback dummy URL to satisfy Prisma 7's strict constructor validation.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/db";
}

// Global singleton to prevent connection exhaustion in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
