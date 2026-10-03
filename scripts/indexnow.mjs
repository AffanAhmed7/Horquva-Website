#!/usr/bin/env node

// Tells Bing, Yandex and the other IndexNow search engines to re-crawl the site now,
// instead of waiting for their next visit. Run after deploying content changes:
//
//   npm run indexnow                      (every page in the live sitemap)
//   npm run indexnow -- /about-us /blog   (plus extra paths, e.g. old addresses to re-check)
//
// The key below must match public/<key>.txt, which proves to the search engines that we own the site.

const HOST = "horquva.com";
const KEY = "b9aa9370e04e785c171c966baafd2745";

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`Couldn't load the sitemap (${r.status})`);
  return r.text();
});
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const extra = process.argv.slice(2).map((p) => `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`);
const urlList = [...new Set([...pages, ...extra])];

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`❌ https://${HOST}/${KEY}.txt isn't live yet. Deploy first, then run this again.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

// 200 = accepted, 202 = accepted and the key is still being verified.
if (res.status === 200 || res.status === 202) {
  console.log(`✅ Submitted ${urlList.length} URL(s) to IndexNow (${res.status}).`);
  for (const u of urlList) console.log(`   ${u}`);
} else {
  console.error(`❌ IndexNow rejected the submission (${res.status}): ${await res.text()}`);
  process.exit(1);
}
