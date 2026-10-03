import { describe, it, expect } from "vitest";
import { isLegacyWordPressUrl } from "@/lib/legacy-wordpress";
import { services } from "@/content/services";

const check = (path: string) => isLegacyWordPressUrl(new URL(path, "https://horquva.com"));

describe("isLegacyWordPressUrl", () => {
  it.each([
    "/wp-admin/",
    "/wp-login.php",
    "/wp-content/uploads/2026/03/logo.png",
    "/xmlrpc.php",
    "/feed/",
    "/category/news/",
    "/tag/ai",
    "/author/admin/",
    "/blog",
    "/blog/some-post",
    "/sample-page/",
    "/hello-world/",
    "/2026/03/hello-world/",
    "/page/2/",
    "/?p=12",
    "/?page_id=5",
    "/?s=oba",
  ])("flags old WordPress address %s", (path) => {
    expect(check(path)).toBe(true);
  });

  it.each([
    "/",
    "/oba-core",
    "/approach",
    "/team",
    "/careers",
    "/contact",
    "/contact?sent=1",
    "/privacy",
    "/sitemap.xml",
    "/robots.txt",
    "/opengraph-image",
    ...services.map((s) => `/services/${s.slug}`),
  ])("leaves the current site's %s alone", (path) => {
    expect(check(path)).toBe(false);
  });
});
