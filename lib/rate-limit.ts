import { Redis } from "@upstash/redis";

/**
 * Sliding-window limiter kept in memory. Per server instance only, which is
 * enough to slow down a single abusive client at this site's traffic level.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function allow(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}

/**
 * Fixed-window limiter counted in Upstash Redis, so it holds across serverless
 * instances. Falls back to the in-memory limiter when Redis isn't configured or fails.
 */
export function createSharedRateLimiter({
  prefix,
  limit,
  windowSeconds,
}: {
  prefix: string;
  limit: number;
  windowSeconds: number;
}) {
  const allowInMemory = createRateLimiter({ limit, windowMs: windowSeconds * 1000 });

  return async function allow(key: string): Promise<boolean> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return allowInMemory(key);

    const window = Math.floor(Date.now() / 1000 / windowSeconds);
    const redisKey = `${prefix}:${key}:${window}`;
    try {
      const redis = new Redis({ url, token });
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.expire(redisKey, windowSeconds);
      return count <= limit;
    } catch (error) {
      console.warn(`Rate limit check (${prefix}) failed, using in-memory limit:`, error);
      return allowInMemory(key);
    }
  };
}

/**
 * The visitor's IP. Vercel sets x-real-ip itself, so a client can't spoof it the
 * way it can prepend its own entries to x-forwarded-for.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
