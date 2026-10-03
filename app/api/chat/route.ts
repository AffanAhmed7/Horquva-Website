import { cookies } from "next/headers";
import { queryKnowledge } from "@/lib/rag/vector";
import { getSessionHistory, appendSessionHistory } from "@/lib/rag/session";
import { executeModelCascade } from "@/lib/rag/cascade";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_COOKIE_NAME = "woba_session_id";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const message = body?.message?.trim();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Session Cookie Management
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    let isNewSession = false;

    if (!sessionId) {
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
            sources,
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
      headers["Set-Cookie"] = `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
        86400 * 30
      }`;
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
