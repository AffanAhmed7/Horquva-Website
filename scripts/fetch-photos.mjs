// Downloads the photos listed in content/photo-manifest.json into assets/photos/raw
// and writes content/image-credits.json. Run once, or again after editing the manifest.
import { execFileSync } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(path.join(root, "content/photo-manifest.json"), "utf8"));
const outDir = path.join(root, "assets/photos/raw");
await mkdir(outDir, { recursive: true });

const credits = [];
for (const [slot, p] of Object.entries(manifest.photos)) {
  const url = `https://images.unsplash.com/${p.file}?w=2400&q=90&fm=jpg`;
  const file = path.join(outDir, `${slot}.jpg`);
  // curl rather than fetch: it behaves the same behind every network setup we've hit.
  execFileSync("curl", ["-sSfL", "--max-time", "120", "-o", file, url]);
  const { size } = await stat(file);
  credits.push({
    slot,
    // Some photos were picked straight from the image CDN, without their Unsplash page.
    photographer: p.photographer ?? "Unknown",
    source: p.id ? `https://unsplash.com/photos/${p.id}` : url,
    license: "Unsplash License",
  });
  console.log(`${slot.padEnd(26)} ${(size / 1024).toFixed(0)} KB`);
}

await writeFile(path.join(root, "content/image-credits.json"), JSON.stringify(credits, null, 2) + "\n");
console.log(`\n${credits.length} photos saved to assets/photos/raw`);
