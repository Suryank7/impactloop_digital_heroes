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

/**
 * Lazy-loaded Prisma Client to prevent initialization crashes during 
 * Vercel build-time tracing when DATABASE_URL is missing.
 */
export const prisma: PrismaClient = (globalForPrisma.prisma ||
  (() => {
    const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
    const hasNoDbUrl = !process.env.DATABASE_URL;

    if (isBuildPhase || hasNoDbUrl) {
      // During build or if URL is missing, return a dummy proxy to satisfy imports
      return new Proxy({} as any, {
        get: (target, prop) => {
          if (prop === "module") return undefined;
          if (prop === "$on") return () => {};
          if (prop === "toJSON") return () => "PrismaProxy";

          // Return a function/object hybrid to handle model access (e.g. prisma.user.findMany)
          const dummyFunc = () => Promise.resolve(null);
          return new Proxy(dummyFunc, {
            get: (t, subProp) => () => Promise.resolve(null),
          });
        },
      });
    }

    const client = new PrismaClient();
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    return client;
  })()) as PrismaClient;

export default prisma;
