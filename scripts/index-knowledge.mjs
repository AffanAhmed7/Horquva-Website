#!/usr/bin/env node

// Loads the site's content into Upstash Vector for WOBA.
//
//   npm run rag:index -- https://horquva.com       (production, after deploying)
//   npm run rag:index -- http://localhost:3200     (local dev server)
//
// The documents themselves are built in lib/rag/mock-data.ts from content/*.ts,
// so the indexed links always match real pages. This script only asks the
// deployed /api/rag/ingest endpoint to upsert them, authenticated with
// RAG_INGEST_SECRET (read from the environment or .env.local).

import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

try {
  const envContent = await readFile(path.join(root, ".env.local"), "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch {
  // .env.local not found
}

const siteUrl = process.argv[2]?.replace(/\/+$/, "");
const secret = process.env.RAG_INGEST_SECRET?.trim();

if (!siteUrl) {
  console.error("❌ Pass the site URL, e.g. npm run rag:index -- https://horquva.com");
  process.exit(1);
}
if (!secret) {
  console.error("❌ RAG_INGEST_SECRET is not set (add it to .env.local or the environment).");
  process.exit(1);
}

console.log(`🚀 Indexing Horquva site content via ${siteUrl}/api/rag/ingest ...`);

const res = await fetch(`${siteUrl}/api/rag/ingest`, {
  method: "POST",
  headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
  body: JSON.stringify({ source: "site" }),
});

const body = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`❌ Failed (${res.status}): ${body.error ?? "unknown error"}`);
  process.exit(1);
}

console.log(`✅ ${body.message}`);
