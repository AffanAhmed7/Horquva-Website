import { describe, it, expect } from "vitest";
import { buildPromptMessages, executeModelCascade } from "@/lib/rag/cascade";
import { queryKnowledge } from "@/lib/rag/vector";

describe("RAG Cascade & Knowledge Retrieval", () => {
  it("builds prompt messages containing system instructions, context chunks, and history", () => {
    const query = "What services does Horquva provide?";
    const history = [{ role: "user" as const, content: "Hi" }, { role: "assistant" as const, content: "Hello!" }];
    const sources = [
      {
        id: "service-ai-automation",
        title: "AI and automation",
        url: "/services/ai-automation",
        snippet: "WhatsApp and web AI agents that take orders.",
        score: 0.95,
      },
    ];

    const messages = buildPromptMessages(query, history, sources);

    expect(messages.length).toBe(4); // system, user(Hi), assistant(Hello), user(query)
    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("WOBA");
    expect(messages[0].content).toContain("AI and automation");
    expect(messages[0].content).toContain("/services/ai-automation");
    expect(messages[3].content).toBe(query);
  });

  it("retrieves relevant knowledge chunks for Horquva services and OBA Core", async () => {
    const obaResults = await queryKnowledge("oba core platform simulation", 3);
    expect(obaResults.length).toBeGreaterThan(0);
    expect(obaResults.some((r) => r.title.toLowerCase().includes("oba") || r.url.includes("oba-core"))).toBe(true);

    const contactResults = await queryKnowledge("how to contact for a quote", 2);
    expect(contactResults.length).toBeGreaterThan(0);
    expect(contactResults.some((r) => r.url === "/contact")).toBe(true);
  });

  it("executes model cascade and yields streamed tokens via async iterator", async () => {
    const sources = await queryKnowledge("tell me about oba core", 2);
    const { tokenStream, provider, model } = await executeModelCascade(
      "tell me about oba core",
      [],
      sources,
    );

    expect(provider).toBeDefined();
    expect(model).toBeDefined();

    let fullOutput = "";
    for await (const chunk of tokenStream) {
      fullOutput += chunk;
    }

    expect(fullOutput.length).toBeGreaterThan(10);
    expect(fullOutput.toLowerCase()).toContain("oba");
  });
});
