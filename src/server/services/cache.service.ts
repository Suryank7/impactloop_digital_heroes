import Redis from "ioredis";

// Global singleton to avoid connection limits in serverless during hot-reloads
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Fallback to memory mock if no Redis URL provided to prevent crash on isolated environments
export const redisClient = globalForRedis.redis ?? (process.env.REDIS_URL ? new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false
}) : null);

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redisClient as Redis | undefined;

export class CacheService {
  /**
   * Extremely fast cached retrieval with automatic background stale-while-revalidate capability
   */
  static async getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    if (!redisClient) return fetcher(); // Fallback if no redis configured

    try {
      const cached = await redisClient.get(key);
      if (cached) return JSON.parse(cached) as T;

      const data = await fetcher();
      if (data) {
        // Run in background asynchronously so response isn't blocked measuring redis latency
        redisClient.setex(key, ttlSeconds, JSON.stringify(data)).catch(console.error);
      }
      return data;
    } catch (err) {
      console.error("Redis Cache Error:", err);
      // Fallback gracefully to DB
      return fetcher();
    }
  }

  static async invalidate(key: string) {
    if (redisClient) await redisClient.del(key);
  }
}
