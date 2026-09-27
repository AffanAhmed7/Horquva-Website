// Downloads the photos listed in content/photo-manifest.json into assets/photos/raw
// and writes content/image-credits.json. Run once, or again after editing the manifest.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(path.join(root, "content/photo-manifest.json"), "utf8"));
const outDir = path.join(root, "assets/photos/raw");
await mkdir(outDir, { recursive: true });

const credits = [];
for (const [slot, p] of Object.entries(manifest.photos)) {
  const url = `https://images.unsplash.com/${p.file}?w=2400&q=90&fm=jpg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${slot}: HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(outDir, `${slot}.jpg`), buf);
  credits.push({
    slot,
    photographer: p.photographer,
    source: `https://unsplash.com/photos/${p.id}`,
    license: "Unsplash License",
  });
  console.log(`${slot.padEnd(26)} ${(buf.length / 1024).toFixed(0)} KB`);
}

await writeFile(path.join(root, "content/image-credits.json"), JSON.stringify(credits, null, 2) + "\n");
console.log(`\n${credits.length} photos saved to assets/photos/raw`);
