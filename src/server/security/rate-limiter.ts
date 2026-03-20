import { redisClient } from "../services/cache.service";
import { NextResponse } from "next/server";

interface RateLimitConfig {
  limit: number;      // Maximum requests allowed
  windowSec: number;  // Time window in seconds
}

export class RateLimiter {
  /**
   * Implements a sliding window rate limiter utilizing Redis hashes and expires
   */
  static async limitOrThrow(identifier: string, config: RateLimitConfig = { limit: 10, windowSec: 60 }) {
    if (!redisClient) return; // Pass through if redis is not available

    const key = `ratelimit:${identifier}`;
    
    try {
      const currentRequests = await redisClient.incr(key);
      
      // If this is the first request in the window, set the TTL
      if (currentRequests === 1) {
        await redisClient.expire(key, config.windowSec);
      }
      
      if (currentRequests > config.limit) {
         throw new Error("RATE_LIMIT_EXCEEDED");
      }
    } catch (e: any) {
      if (e.message === "RATE_LIMIT_EXCEEDED") {
         throw e; // Bubble up intentionally blocked errors
      }
      console.warn("Rate limit redis failure, bypassing open...", e);
    }
  }

  /**
   * API Wrapper utility to easily inject rate limits
   */
  static handleRateLimitError(err: unknown) {
     if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
         return NextResponse.json(
            { status: "error", message: "Too many requests. Please try again shortly." }, 
            { status: 429, headers: { "Retry-After": "60" } }
         );
     }
     return null;
  }
}
