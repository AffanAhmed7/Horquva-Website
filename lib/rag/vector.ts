import { Index } from "@upstash/vector";
import type { RagSource } from "./types";
import { mockSearchKnowledge } from "./mock-data";

function getVectorIndex(): Index | null {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  try {
    return new Index({ url, token });
  } catch (error) {
    console.warn("Failed to initialize Upstash Vector index:", error);
    return null;
  }
}

/**
 * Queries Upstash Vector using built-in hosted embeddings (data: query).
 * Falls back to local structured mock knowledge if Upstash is unconfigured or unavailable.
 */
export async function queryKnowledge(query: string, topK = 4): Promise<RagSource[]> {
  const index = getVectorIndex();

  if (!index) {
    return mockSearchKnowledge(query, topK);
  }

  try {
    const results = await index.query<{
      title?: string;
      url?: string;
      section?: string;
      content?: string;
    }>({
      data: query,
      topK,
      includeMetadata: true,
      includeData: true,
    });

    if (!results || results.length === 0) {
      return mockSearchKnowledge(query, topK);
    }

    return results.map((r, i) => {
      const metadata = r.metadata || {};
      const snippet =
        metadata.content ||
        (typeof r.data === "string" ? r.data : "") ||
        metadata.section ||
        "";

      return {
        id: String(r.id || `vec-${i}`),
        title: metadata.title || "Horquva Documentation",
        url: metadata.url || "/services",
        snippet: snippet.slice(0, 280) + (snippet.length > 280 ? "…" : ""),
        score: r.score ?? 1,
      };
    });
  } catch (error) {
    console.warn("Upstash Vector query failed, falling back to local mock knowledge:", error);
    return mockSearchKnowledge(query, topK);
  }
}

/**
 * Upserts text chunks with metadata into Upstash Vector.
 * Uses Upstash's built-in hosted embedding model.
 */
export async function upsertKnowledge(
  chunks: Array<{
    id: string;
    text: string;
    metadata: {
      title: string;
      url: string;
      section?: string;
      content?: string;
    };
  }>,
): Promise<{ success: boolean; count: number; error?: string }> {
  const index = getVectorIndex();

  if (!index) {
    return {
      success: false,
      count: 0,
      error: "UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be configured in .env.local",
    };
  }

  try {
    const vectors = chunks.map((c) => ({
      id: c.id,
      data: c.text,
      metadata: {
        ...c.metadata,
        content: c.text,
      },
    }));

    await index.upsert(vectors);
    return { success: true, count: vectors.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, count: 0, error: message };
  }
}
