#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { Index } from "@upstash/vector";

const root = path.resolve(import.meta.dirname, "..");

// 1. Load .env.local if present
try {
  const envContent = await readFile(path.join(root, ".env.local"), "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
} catch {
  // .env.local not found
}

const vectorUrl = process.env.UPSTASH_VECTOR_REST_URL?.trim();
const vectorToken = process.env.UPSTASH_VECTOR_REST_TOKEN?.trim();

if (!vectorUrl || !vectorToken) {
  console.error("❌ Error: Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN.");
  console.error("Please add your free Upstash Vector credentials to .env.local first.");
  process.exit(1);
}

const index = new Index({ url: vectorUrl, token: vectorToken });

console.log("📦 Preparing Horquva knowledge base documents...");

// Extract content sections
const documents = [];

// Read README.md
try {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  documents.push({
    id: "site-readme",
    title: "Horquva Architecture & Overview",
    url: "/approach",
    section: "Overview",
    content: readme.slice(0, 1500),
  });
} catch (e) {
  console.warn("Could not read README.md:", e.message);
}

// Read content files as text to extract structured sections
async function extractContentFile(filename, fallbackTitle, url) {
  try {
    const text = await readFile(path.join(root, "content", filename), "utf8");
    // Remove TS exports/syntax to extract readable copy
    const clean = text
      .replace(/export const \w+ =/g, "")
      .replace(/as const;/g, "")
      .replace(/["'`]/g, "")
      .replace(/[{}\[\],]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      id: `content-${filename.replace(/\.ts$/, "")}`,
      title: fallbackTitle,
      url,
      section: filename.replace(/\.ts$/, ""),
      content: clean,
    };
  } catch (err) {
    console.warn(`Could not read content/${filename}:`, err.message);
    return null;
  }
}

const siteDoc = await extractContentFile("site.ts", "Horquva Company Overview & Contact", "/contact");
if (siteDoc) documents.push(siteDoc);

const servicesDoc = await extractContentFile("services.ts", "Horquva Engineering Services", "/services");
if (servicesDoc) documents.push(servicesDoc);

const obaDoc = await extractContentFile("oba.ts", "OBA Core Platform", "/oba-core");
if (obaDoc) documents.push(obaDoc);

const processDoc = await extractContentFile("process.ts", "Horquva Engineering Process", "/approach");
if (processDoc) documents.push(processDoc);

const teamDoc = await extractContentFile("team.ts", "Horquva Team & Leadership", "/team");
if (teamDoc) documents.push(teamDoc);

// Chunk documents into ~250 word passages
function chunkDocument(doc, maxWords = 250) {
  const words = doc.content.split(/\s+/);
  if (words.length <= maxWords) {
    return [
      {
        id: doc.id,
        text: doc.content,
        metadata: { title: doc.title, url: doc.url, section: doc.section, content: doc.content },
      },
    ];
  }

  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords - 40) {
    const chunkWords = words.slice(i, i + maxWords);
    if (chunkWords.length > 0) {
      const text = chunkWords.join(" ");
      chunks.push({
        id: `${doc.id}-part-${chunks.length + 1}`,
        text,
        metadata: {
          title: doc.title,
          url: doc.url,
          section: doc.section,
          content: text,
        },
      });
    }
  }
  return chunks;
}

const allChunks = documents.flatMap((doc) => chunkDocument(doc));
console.log(`🚀 Ingesting ${allChunks.length} knowledge chunk(s) into Upstash Vector...`);

try {
  const vectors = allChunks.map((c) => ({
    id: c.id,
    data: c.text, // Uses Upstash hosted embedding model
    metadata: c.metadata,
  }));

  // Upsert in batches of 10
  const batchSize = 10;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    console.log(`  ✓ Indexed chunk ${i + 1} to ${Math.min(i + batchSize, vectors.length)} of ${vectors.length}`);
  }

  console.log("✅ Successfully indexed Horquva knowledge base into Upstash Vector!");
} catch (error) {
  console.error("❌ Failed to index vectors:", error);
  process.exit(1);
}
