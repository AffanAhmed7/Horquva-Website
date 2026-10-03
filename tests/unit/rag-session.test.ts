import { describe, it, expect, beforeEach } from "vitest";
import { getSessionHistory, appendSessionHistory, resetSessionHistory } from "@/lib/rag/session";

describe("RAG Session Context Storage", () => {
  const testSessionId = "test-session-123";

  beforeEach(async () => {
    await resetSessionHistory(testSessionId);
  });

  it("returns empty history for a new session", async () => {
    const history = await getSessionHistory(testSessionId);
    expect(history).toEqual([]);
  });

  it("appends messages and retrieves conversation history", async () => {
    await appendSessionHistory(testSessionId, "Hello Woba", "Hello! How can I help you today?");
    const history = await getSessionHistory(testSessionId);

    expect(history).toHaveLength(2);
    expect(history[0]).toEqual({ role: "user", content: "Hello Woba" });
    expect(history[1]).toEqual({ role: "assistant", content: "Hello! How can I help you today?" });
  });

  it("enforces sliding window cap of 8 messages", async () => {
    // Append 5 turns (10 messages total)
    for (let i = 1; i <= 5; i++) {
      await appendSessionHistory(testSessionId, `Question ${i}`, `Answer ${i}`);
    }

    const history = await getSessionHistory(testSessionId);
    expect(history).toHaveLength(8);
    // Oldest turn (Question 1) should be dropped
    expect(history[0].content).toBe("Question 2");
    expect(history[history.length - 1].content).toBe("Answer 5");
  });

  it("clears session history on reset", async () => {
    await appendSessionHistory(testSessionId, "Question", "Answer");
    await resetSessionHistory(testSessionId);
    const history = await getSessionHistory(testSessionId);
    expect(history).toEqual([]);
  });
});
