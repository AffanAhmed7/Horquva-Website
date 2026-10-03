import { timingSafeEqual } from "node:crypto";
import { upsertKnowledge } from "@/lib/rag/vector";
import { knowledgeDocs } from "@/lib/rag/mock-data";

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

function isAuthorized(req: Request, secret: string): boolean {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  const given = Buffer.from(token);
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  try {
    // Whatever lands in the index is what WOBA tells visitors, so writes are
    // refused outright until a secret is configured.
    const secret = process.env.RAG_INGEST_SECRET?.trim();
    if (!secret) {
      return new Response(JSON.stringify({ error: "Ingestion is disabled: RAG_INGEST_SECRET is not set" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!isAuthorized(req, secret)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // { "source": "site" } re-indexes the site's own content (see lib/rag/mock-data.ts).
    const rawItems: IngestItem[] =
      body.source === "site"
        ? knowledgeDocs.map(({ id, title, url, section, content }) => ({ id, title, url, section, content }))
        : Array.isArray(body.chunks)
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
