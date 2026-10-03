import { services } from "@/content/services";
import { pages } from "@/content/site";

/**
 * horquva.com used to be a WordPress site, and search engines still list its pages. Rather than
 * tracking each old address, every address that isn't part of this site gets a 410 Gone (removed
 * on purpose), which drops it from results faster than a 404. Old pages with a clear new home are
 * redirected in next.config.ts, and those redirects run before this check.
 */

const servicePaths = new Set(services.map((s) => `/services/${s.slug}`));

// Files and framework routes this site serves besides its pages.
const SITE_FILES = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
  "/logo-mark.png",
]);
const SITE_PREFIXES = ["/_next/", "/api/", "/photos/", "/opengraph-image", "/__nextjs"];
// The IndexNow ownership key in public/ (32 hex characters).
const INDEXNOW_KEY_FILE = /^\/[a-f0-9]{32}\.txt$/;

// Query strings WordPress used for posts, pages, search and attachments. None are used on this site.
const LEGACY_PARAMS = ["p", "page_id", "cat", "tag", "s", "attachment_id", "author", "preview", "feed"];

export function isCurrentSitePath(pathname: string): boolean {
  return (
    pages.includes(pathname) ||
    servicePaths.has(pathname) ||
    SITE_FILES.has(pathname) ||
    INDEXNOW_KEY_FILE.test(pathname) ||
    SITE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

/** True for any address left over from the old site: anything this site doesn't serve. */
export function isRetiredUrl(url: URL): boolean {
  if (LEGACY_PARAMS.some((param) => url.searchParams.has(param))) return true;
  return !isCurrentSitePath(url.pathname);
}

export const GONE_HTML = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page removed | Horquva Inc.</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#15120f;color:#f3efe7;font-family:system-ui,sans-serif;text-align:center;padding:24px">
<main>
<h1 style="font-weight:300;font-size:40px;margin:0 0 16px">This page has been removed</h1>
<p style="color:#b9b2a8;margin:0 0 28px">It belonged to the previous version of our website.</p>
<a href="/" style="color:#f3efe7;text-decoration:underline;text-decoration-color:#a9825a;text-underline-offset:6px">Go to the Horquva home page</a>
</main>
</body>
</html>`;
