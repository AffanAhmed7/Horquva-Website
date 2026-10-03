import { cookies } from "next/headers";
import { queryKnowledge } from "@/lib/rag/vector";
import { getSessionHistory, appendSessionHistory, sessionCookie, SESSION_COOKIE_NAME } from "@/lib/rag/session";
import { executeModelCascade } from "@/lib/rag/cascade";
import { allowChatMessage } from "@/lib/rag/chat-limit";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1000;

const jsonError = (error: string, status: number) =>
  new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return jsonError("Message is required", 400);
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonError(`Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`, 400);
    }

    const ip = getClientIp(req);
    if (!(await allowChatMessage(ip))) {
      return jsonError(
        "You've sent a lot of messages in a short time. Please wait a few minutes, or reach the team directly through [Contact](/contact).",
        429,
      );
    }

    // 1. Session Cookie Management
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    let isNewSession = false;

    // The id becomes a Redis key, so only accept ids this server could have issued.
    if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
      sessionId = crypto.randomUUID();
      isNewSession = true;
    }

    // 2. Query Knowledge Base via Vector DB (with local mock fallback)
    const sources = await queryKnowledge(message, 4);

    // 3. Retrieve Session History from Redis (with local memory fallback)
    const history = await getSessionHistory(sessionId);

    // 4. Execute 4-Tier Model Cascade (Groq 70B -> Groq 8B -> OpenRouter 70B -> OpenRouter 8B -> Local Mock)
    const { tokenStream, provider, model } = await executeModelCascade(message, history, sources);

    // 5. Construct SSE Streaming Response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const token of tokenStream) {
            fullResponse += token;
            const payload = JSON.stringify({ type: "token", token });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }

          // Emit sources metadata once generation is complete
          const sourcesPayload = JSON.stringify({
            type: "sources",
            // Previews only: the full retrieved text stays on the server.
            sources: sources.map((s) => ({ id: s.id, title: s.title, url: s.url, snippet: s.snippet, score: s.score })),
            provider,
            model,
          });
          controller.enqueue(encoder.encode(`data: ${sourcesPayload}\n\n`));

          // Emit done signal
          controller.enqueue(encoder.encode(`data: {"type":"done"}\n\n`));

          // Save complete turn to session history
          if (sessionId && fullResponse.trim()) {
            await appendSessionHistory(sessionId, message, fullResponse.trim());
          }
        } catch (streamError) {
          console.error("Stream generation error:", streamError);
          const errorPayload = JSON.stringify({
            type: "error",
            error: "An error occurred while generating the response.",
          });
          controller.enqueue(encoder.encode(`data: ${errorPayload}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    };

    if (isNewSession) {
      headers["Set-Cookie"] = sessionCookie(sessionId);
    }

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Chat API handler error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
