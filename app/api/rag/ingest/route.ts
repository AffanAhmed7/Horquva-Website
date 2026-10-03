import { upsertKnowledge } from "@/lib/rag/vector";

export const runtime = "nodejs";

interface IngestItem {
  id?: string;
  title: string;
  url: string;
  section?: string;
  content: string;
}

function chunkText(text: string, maxWords = 250): string[] {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return [text.trim()];

  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += maxWords - 30) {
    const chunkWords = words.slice(i, i + maxWords);
    if (chunkWords.length > 0) {
      chunks.push(chunkWords.join(" "));
    }
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.RAG_INGEST_SECRET;
    const authHeader = req.headers.get("authorization");

    // Guard endpoint if RAG_INGEST_SECRET is set
    if (secret) {
      const token = authHeader?.replace(/^Bearer\s+/i, "")?.trim();
      if (token !== secret) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rawItems: IngestItem[] = Array.isArray(body.chunks)
      ? body.chunks
      : body.content
      ? [body]
      : [];

    if (!rawItems.length) {
      return new Response(JSON.stringify({ error: "No content or chunks provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chunksToUpsert: Array<{
      id: string;
      text: string;
      metadata: {
        title: string;
        url: string;
        section?: string;
        content?: string;
      };
    }> = [];

    for (let itemIdx = 0; itemIdx < rawItems.length; itemIdx++) {
      const item = rawItems[itemIdx];
      const title = item.title?.trim() || "Untitled Document";
      const url = item.url?.trim() || "/";
      const section = item.section?.trim() || "General";
      const content = item.content?.trim() || "";

      if (!content) continue;

      const subChunks = chunkText(content);
      subChunks.forEach((chunk, chunkIdx) => {
        const id = item.id
          ? `${item.id}-${chunkIdx}`
          : `dyn-${Date.now()}-${itemIdx}-${chunkIdx}`;

        chunksToUpsert.push({
          id,
          text: chunk,
          metadata: {
            title,
            url,
            section,
            content: chunk,
          },
        });
      });
    }

    if (chunksToUpsert.length === 0) {
      return new Response(JSON.stringify({ error: "No valid text to ingest" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await upsertKnowledge(chunksToUpsert);

    if (!result.success) {
      const isMissingConfig = result.error?.includes("must be configured");
      return new Response(JSON.stringify({ error: result.error || "Upsert failed" }), {
        status: isMissingConfig ? 503 : 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully ingested ${result.count} knowledge chunk(s).`,
        count: result.count,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Dynamic RAG ingestion error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
