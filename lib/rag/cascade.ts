import Groq from "groq-sdk";
import type { ChatMessage, RagSource } from "./types";

export interface CascadeResult {
  tokenStream: AsyncIterable<string>;
  provider: string;
  model: string;
}

const SYSTEM_PROMPT_TEMPLATE = `You are WOBA, the official assistant for Horquva LLC (horquva.com). Horquva builds robust software, conversational AI agents, and enterprise automations for businesses that cannot afford downtime.

GUIDELINES:
1. Tone: Engineering-led, concise, plain-spoken, and confident. Never use AI filler words (do NOT say: "seamless", "delve", "leverage", "revolutionize", "cutting-edge", "game-changer", "empower").
2. Grounding: Answer strictly using the information in the RETRIEVED CONTEXT below. If the context doesn't contain the answer, politely state what Horquva does and suggest reaching out at [Contact](/contact).
3. Links: Whenever you mention a service, page, or contact method, format it as an inline markdown link:
   - [AI Agents & Chat Automation](/services/ai-agents)
   - [Knowledge Assistants](/services/knowledge-assistants)
   - [Document & Vision AI](/services/document-vision-ai)
   - [Voice AI](/services/voice-ai)
   - [Automation & Integrations](/services/automation-integrations)
   - [Web & Product Engineering](/services/web-software-development)
   - [WordPress & CMS](/services/wordpress-cms-development)
   - [Data & Analytics](/services/data-analytics-business-intelligence)
   - [OBA Core Platform](/oba-core)
   - [Our Approach](/approach)
   - [Engineering Team](/team)
   - [Contact & Enquiries](/contact)
4. Length: Keep answers concise (2 to 4 sentences or a short bulleted list), formatted for a compact dark chat panel.`;

export function buildPromptMessages(
  query: string,
  history: ChatMessage[],
  sources: RagSource[],
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const contextSnippet = sources.length
    ? sources
        .map((s, i) => `[Source ${i + 1}: ${s.title} (${s.url})]\n${s.snippet}`)
        .join("\n\n")
    : "No external documents retrieved. Answer based on Horquva core services and platform.";

  const systemContent = `${SYSTEM_PROMPT_TEMPLATE}\n\nRETRIEVED CONTEXT:\n${contextSnippet}`;

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemContent },
  ];

  // Include recent session history
  for (const msg of history) {
    if (msg.role === "user" || msg.role === "assistant") {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: query });
  return messages;
}

/**
 * Streams chat completion from Groq.
 */
async function streamGroq(
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  apiKey: string,
): Promise<AsyncIterable<string>> {
  const groq = new Groq({ apiKey });
  const response = await groq.chat.completions.create({
    model,
    messages,
    stream: true,
    max_tokens: 500,
    temperature: 0.3,
  });

  return {
    async *[Symbol.asyncIterator]() {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) yield text;
      }
    },
  };
}

/**
 * Streams chat completion from OpenRouter Free API using standard fetch and SSE.
 */
async function streamOpenRouter(
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  apiKey: string,
): Promise<AsyncIterable<string>> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://horquva.com",
      "X-Title": "Horquva Website",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`OpenRouter error ${res.status}: ${errorText}`);
  }

  if (!res.body) {
    throw new Error("No response body received from OpenRouter");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":")) continue;
            if (trimmed === "data: [DONE]") return;
            if (trimmed.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) yield text;
              } catch {
                // Ignore incomplete SSE json fragments
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}

/**
 * Local mock generator for developer environments without API keys.
 */
function streamLocalMock(
  query: string,
  sources: RagSource[],
): AsyncIterable<string> {
  const top = sources[0];
  let answer = "";

  const q = query.toLowerCase();
  if (q.includes("oba")) {
    answer =
      "**[OBA Core](/oba-core)** is Horquva's platform for organizational intelligence. It maps system dependencies, understands real-time anomalies, and simulates operational impact across 5 continuous steps: Connect, Map, Understand, Simulate, and Act.";
  } else if (q.includes("service") || q.includes("build") || q.includes("what does")) {
    answer =
      "Horquva engineers mission-critical software and AI solutions across 8 specialized domains, including **[AI Agents & Chat Automation](/services/ai-agents)**, **[Knowledge Assistants](/services/knowledge-assistants)**, **[Voice AI](/services/voice-ai)**, and **[Web & Product Engineering](/services/web-software-development)**. You can see the full breakdown on our [Services](/services) page.";
  } else if (q.includes("start") || q.includes("process") || q.includes("how does")) {
    answer =
      "Projects follow our 4-stage engineering lifecycle: Discover, Prototype, Build, and Support. Check out **[Our Approach](/approach)** for our technical philosophy and testing standards.";
  } else if (q.includes("contact") || q.includes("touch") || q.includes("quote") || q.includes("price")) {
    answer =
      "You can begin a project by submitting our **[Enquiry Form](/contact)** or emailing us at contact@horquva.com. Our engineering leads typically respond with a scoped feasibility review within 1–2 business days.";
  } else if (top) {
    answer = `Based on our documentation for **[${top.title}](${top.url})**: ${top.snippet} For more details, explore the full specification or reach out through our [Contact](/contact) page.`;
  } else {
    answer =
      "Horquva builds custom software, AI agents, and resilient automations. If you have a specific problem or project in mind, reach out directly via our **[Contact](/contact)** page.";
  }

  const chunks = answer.split(" ");
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) {
        yield chunk + " ";
        await new Promise((r) => setTimeout(r, 25));
      }
    },
  };
}

/**
 * 4-Tier Model Cascade with auto-failover:
 * 1. Groq: llama-3.3-70b-versatile
 * 2. Groq: llama-3.1-8b-instant
 * 3. OpenRouter Free: meta-llama/llama-3.3-70b-instruct:free
 * 4. OpenRouter Free: meta-llama/llama-3.1-8b-instruct:free
 * 5. Local Mock Fallback
 */
const GROQ_CANDIDATE_MODELS = [
  process.env.GROQ_MODEL?.trim(),
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "qwen/qwen3.8-27b",
].filter((m): m is string => Boolean(m));

const OPENROUTER_CANDIDATE_MODELS = [
  process.env.OPENROUTER_MODEL?.trim(),
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
].filter((m): m is string => Boolean(m));

export async function executeModelCascade(
  query: string,
  history: ChatMessage[],
  sources: RagSource[],
): Promise<CascadeResult> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  const messages = buildPromptMessages(query, history, sources);

  // 1. Try Groq Candidate Models in Order
  if (groqKey) {
    for (const model of GROQ_CANDIDATE_MODELS) {
      try {
        const stream = await streamGroq(model, messages, groqKey);
        return { tokenStream: stream, provider: "groq", model };
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`Groq model ${model} failed (${status || msg}), trying next candidate...`);
      }
    }
  }

  // 2. Try OpenRouter Free Candidate Models in Order
  if (openRouterKey) {
    for (const model of OPENROUTER_CANDIDATE_MODELS) {
      try {
        const stream = await streamOpenRouter(model, messages, openRouterKey);
        return { tokenStream: stream, provider: "openrouter", model };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`OpenRouter model ${model} failed (${msg}), trying next candidate...`);
      }
    }
  }

  // 3. Local Mock Fallback
  return {
    tokenStream: streamLocalMock(query, sources),
    provider: "local-mock",
    model: "woba-local-knowledge",
  };
}
