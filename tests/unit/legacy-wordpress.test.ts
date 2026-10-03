import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { isCurrentSitePath, isRetiredUrl } from "@/lib/legacy-wordpress";
import { services } from "@/content/services";

const root = path.resolve(import.meta.dirname, "../..");
const retired = (address: string) => isRetiredUrl(new URL(address, "https://horquva.com"));

/** Every file under a folder, as paths relative to it with forward slashes. */
function filesUnder(dir: string, base = dir): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? filesUnder(full, base) : [path.relative(base, full).replaceAll("\\", "/")];
  });
}

describe("old site addresses are retired", () => {
  it.each([
    "/about-us/team",
    "/architecture",
    "/press",
    "/press-releases",
    "/news",
    "/news/launch-announcement",
    "/integrations",
    "/enterprise",
    "/for-startups",
    "/for-mid-market",
    "/resources",
    "/schedule-a-demo",
    "/wp-admin",
    "/wp-login.php",
    "/wp-content/uploads/2026/03/logo.png",
    "/category/news",
    "/2026/03/hello-world",
    "/?p=12",
    "/?page_id=5",
    "/?s=oba",
    "/services/voice-ai",
  ])("%s", (address) => {
    expect(retired(address)).toBe(true);
  });
});

describe("the current site is never retired", () => {
  // Every page.tsx under app/ becomes a page; [slug] folders are the service pages.
  const routes = filesUnder(path.join(root, "app"))
    .filter((f) => /(^|\/)page\.tsx$/.test(f))
    .flatMap((f) => {
      const route = "/" + f.replace(/(^|\/)page\.tsx$/, "");
      if (route.includes("[slug]")) return services.map((s) => route.replace("[slug]", s.slug));
      return [route === "/" ? "/" : route.replace(/\/$/, "")];
    });

  it("finds the site's pages", () => {
    expect(routes.length).toBeGreaterThan(10);
  });

  it.each(routes)("page %s", (route) => {
    expect(isCurrentSitePath(route)).toBe(true);
  });

  it.each(filesUnder(path.join(root, "public")).map((f) => `/${f}`))("public file %s", (file) => {
    expect(isCurrentSitePath(file)).toBe(true);
  });

  it.each(["/sitemap.xml", "/robots.txt", "/opengraph-image", "/favicon.ico", "/icon.png", "/apple-icon.png", "/contact?sent=1"])(
    "%s",
    (address) => {
      expect(retired(address)).toBe(false);
    },
  );
});
