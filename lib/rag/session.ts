import { Redis } from "@upstash/redis";
import type { ChatMessage } from "./types";

// In-memory fallback map for local development when Redis credentials are not configured.
const memorySessions = new Map<string, { messages: ChatMessage[]; updatedAt: number }>();

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch (error) {
    console.warn("Failed to initialize Upstash Redis client:", error);
    return null;
  }
}

const SESSION_TTL_SECONDS = 86400; // 24 hours
const MAX_TURNS_HISTORY = 8; // 4 user turns + 4 assistant turns (sliding window)

function getSessionKey(sessionId: string): string {
  return `woba:session:${sessionId}`;
}

/**
 * Retrieves the recent conversation history for a given session.
 */
export async function getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
  if (!sessionId) return [];

  const redis = getRedisClient();

  if (!redis) {
    const entry = memorySessions.get(sessionId);
    if (!entry) return [];
    return entry.messages.slice(-MAX_TURNS_HISTORY);
  }

  try {
    const data = await redis.get<ChatMessage[]>(getSessionKey(sessionId));
    if (!data || !Array.isArray(data)) return [];
    return data.slice(-MAX_TURNS_HISTORY);
  } catch (error) {
    console.warn("Error reading session history from Upstash Redis:", error);
    const entry = memorySessions.get(sessionId);
    return entry ? entry.messages.slice(-MAX_TURNS_HISTORY) : [];
  }
}

/**
 * Appends a user message and assistant response to the session history.
 */
export async function appendSessionHistory(
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
): Promise<void> {
  if (!sessionId) return;

  const current = await getSessionHistory(sessionId);
  const updated = [
    ...current,
    { role: "user" as const, content: userMessage },
    { role: "assistant" as const, content: assistantMessage },
  ].slice(-MAX_TURNS_HISTORY);

  const redis = getRedisClient();

  if (!redis) {
    memorySessions.set(sessionId, { messages: updated, updatedAt: Date.now() });
    return;
  }

  try {
    await redis.set(getSessionKey(sessionId), updated, { ex: SESSION_TTL_SECONDS });
  } catch (error) {
    console.warn("Error writing session history to Upstash Redis:", error);
    memorySessions.set(sessionId, { messages: updated, updatedAt: Date.now() });
  }
}

/**
 * Resets / clears a session's conversation history.
 */
export async function resetSessionHistory(sessionId: string): Promise<void> {
  if (!sessionId) return;

  memorySessions.delete(sessionId);
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(getSessionKey(sessionId));
    } catch (error) {
      console.warn("Error clearing session from Upstash Redis:", error);
    }
  }
}
