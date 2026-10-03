/**
 * horquva.com used to be a WordPress site. Search engines still remember its addresses, so they
 * get a 410 Gone (removed on purpose), which drops them from results faster than a 404.
 * Old pages with a clear new home are redirected in next.config.ts instead.
 */

// Paths WordPress uses for its admin, files, feeds and archives.
const LEGACY_PATH =
  /^\/(wp-admin|wp-content|wp-includes|wp-json|wp-login\.php|wp-cron\.php|xmlrpc\.php|wp-sitemap|feed|comments\/feed|category|tag|author|blog|sample-page|hello-world|page\/\d+)(\/|$|\.)|^\/\d{4}\/(\d{2}\/)?/i;

// Query strings WordPress uses for posts, pages, search and attachments. None are used on this site.
const LEGACY_PARAMS = ["p", "page_id", "cat", "tag", "s", "attachment_id", "author", "preview", "feed"];

export function isLegacyWordPressUrl(url: URL): boolean {
  if (LEGACY_PATH.test(url.pathname)) return true;
  return LEGACY_PARAMS.some((param) => url.searchParams.has(param));
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
