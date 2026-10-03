import { createSharedRateLimiter } from "@/lib/rate-limit";

// Per visitor IP. Generous for a real conversation, tight enough that a script
// can't burn through the free Groq / OpenRouter quotas.
export const CHAT_LIMIT = 20;
export const CHAT_WINDOW_SECONDS = 10 * 60;

export const allowChatMessage = createSharedRateLimiter({
  prefix: "woba:limit",
  limit: CHAT_LIMIT,
  windowSeconds: CHAT_WINDOW_SECONDS,
});
