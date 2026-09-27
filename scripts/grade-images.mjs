// Gives every photo the same look: muted colour, warm bronze shadows, a slight matte
// lift and fine grain, so pictures from different photographers read as one set.
//   assets/photos/raw/*.jpg   -> public/photos/*.jpg       (max 2400px wide)
//   assets/photos/team/*.jpg  -> public/photos/team/*.jpg  (4:5 crop, 800px wide)
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");

async function grain(width, height) {
  // Mid-grey noise; blended with soft-light it adds texture without shifting tone.
  const px = Buffer.alloc(width * height);
  for (let i = 0; i < px.length; i++) px[i] = 128 + Math.round((Math.random() - 0.5) * 70);
  return sharp(px, { raw: { width, height, channels: 1 } }).png().toBuffer();
}

async function grade(input, output, { width, crop }) {
  let img = sharp(input).rotate();
  img = crop ? img.resize(width, Math.round((width * 5) / 4), { fit: "cover", position: "attention" }) : img.resize({ width, withoutEnlargement: true });
  const base = await img.toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = base.info;

  const warmShadows = await sharp({ create: { width: w, height: h, channels: 3, background: "#5e3f2c" } }).png().toBuffer();

  await sharp(base.data)
    .modulate({ saturation: 0.78 })
    .linear(0.92, 14) // lift the blacks for a matte finish
    .composite([
      { input: warmShadows, blend: "soft-light" },
      { input: await grain(w, h), blend: "soft-light" },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(output);
  console.log(path.relative(root, output), `${w}×${h}`);
}

for (const [src, dest, opts] of [
  ["assets/photos/raw", "public/photos", { width: 2400 }],
  ["assets/photos/team", "public/photos/team", { width: 800, crop: true }],
]) {
  const inDir = path.join(root, src);
  const outDir = path.join(root, dest);
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(inDir).catch(() => [])).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const f of files) await grade(path.join(inDir, f), path.join(outDir, f.replace(/\.png$/i, ".jpg")), opts);
}
