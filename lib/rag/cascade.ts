import Groq from "groq-sdk";
import { services } from "@/content/services";
import { site } from "@/content/site";
import type { ChatMessage, RagSource } from "./types";

export interface CascadeResult {
  tokenStream: AsyncIterable<string>;
  provider: string;
  model: string;
}

// Built from the site content so every link the model is given is a page that exists.
const SITE_LINKS = [
  ...services.map((svc) => `[${svc.name}](/services/${svc.slug})`),
  "[All services](/#services)",
  "[OBA Core Platform](/oba-core)",
  "[Our Approach](/approach)",
  "[Engineering Team](/team)",
  "[Careers](/careers)",
  "[Contact & Enquiries](/contact)",
]
  .map((link) => `   - ${link}`)
  .join("\n");

const SYSTEM_PROMPT_TEMPLATE = `You are WOBA, the official assistant for ${site.legalName} (horquva.com). Horquva builds robust software, conversational AI agents, and enterprise automations for businesses that cannot afford downtime.

GUIDELINES:
1. Tone: Engineering-led, concise, plain-spoken, and confident. Never use AI filler words (do NOT say: "seamless", "delve", "leverage", "revolutionize", "cutting-edge", "game-changer", "empower").
2. Grounding: Answer strictly using the information in the RETRIEVED CONTEXT below. If the context doesn't contain the answer, politely state what Horquva does and suggest reaching out at [Contact](/contact).
3. Links: Whenever you mention a service, page, or contact method, format it as an inline markdown link. Never cite sources with brackets like 【/team】 or [Source 1]. Only ever use these links, never invent others:
${SITE_LINKS}
4. Contact details: When you give an email address or point to the contact page, put it in one full closing sentence on its own paragraph, separated from the answer by a blank line. For example: "To start a project, use our [Contact & Enquiries](/contact) page or email ${site.email}."
5. Length: Keep answers concise (2 to 4 sentences or a short bulleted list), formatted for a compact dark chat panel.`;

export function buildPromptMessages(
  query: string,
  history: ChatMessage[],
  sources: RagSource[],
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const contextSnippet = sources.length
    ? sources
        .map((s, i) => `[Source ${i + 1}: ${s.title} (${s.url})]\n${s.content ?? s.snippet}`)
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
 * Drops 【...】 citation marks that some models (gpt-oss) add despite the prompt.
 * The marks can be split across tokens, so this tracks whether it is inside one.
 */
export function stripCitationMarks(tokens: AsyncIterable<string>): AsyncIterable<string> {
  return {
    async *[Symbol.asyncIterator]() {
      let inside = false;
      for await (const token of tokens) {
        let out = "";
        for (const ch of token) {
          if (ch === "【") inside = true;
          else if (ch === "】") inside = false;
          else if (!inside) out += ch;
        }
        if (out) yield out;
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
      `Horquva builds software and AI across ${services.length} service areas: ${services
        .map((svc) => `**[${svc.name}](/services/${svc.slug})**`)
        .join(", ")}. You can see them all on our [Services](/#services) section.`;
  } else if (q.includes("start") || q.includes("process") || q.includes("how does")) {
    answer =
      "Projects follow our 4-stage engineering lifecycle: Discover, Prototype, Build, and Support. Check out **[Our Approach](/approach)** for our technical philosophy and testing standards.";
  } else if (q.includes("contact") || q.includes("touch") || q.includes("quote") || q.includes("price")) {
    answer =
      `You can begin a project by submitting our **[Enquiry Form](/contact)** or emailing us at ${site.email}. Our engineering leads typically respond with a scoped feasibility review within 1–2 business days.`;
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
 * Model cascade with auto-failover:
 * 1. Groq: the models in GROQ_CANDIDATE_MODELS
 * 2. OpenRouter Free: the free models in OPENROUTER_CANDIDATE_MODELS
 * 3. Local Mock Fallback
 */
const GROQ_CANDIDATE_MODELS = [
  process.env.GROQ_MODEL?.trim(),
  // Checked against GET https://api.groq.com/openai/v1/models; Groq retires models, so re-check now and then.
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
].filter((m): m is string => Boolean(m));

const OPENROUTER_CANDIDATE_MODELS = [
  process.env.OPENROUTER_MODEL?.trim(),
  // OpenRouter retires free slugs often; re-check https://openrouter.ai/models?q=free before launch.
  "qwen/qwen3.8-27b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
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
        return { tokenStream: stripCitationMarks(stream), provider: "groq", model };
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
        return { tokenStream: stripCitationMarks(stream), provider: "openrouter", model };
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
