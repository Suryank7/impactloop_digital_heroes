import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/db";

// Global singleton to prevent connection exhaustion in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url },
    },
  } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
