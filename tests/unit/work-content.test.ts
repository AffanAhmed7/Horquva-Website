import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { clients, screensOf, visibleQuote } from "@/content/work";

const banned =
  /unlock|empower|seamless|cutting-edge|leverage|revolutioni[sz]e|transform your business|next-generation|supercharge/i;

const bySlug = (slug: string) => clients.find((c) => c.slug === slug)!;
const root = path.resolve(import.meta.dirname, "../..");

describe("work content", () => {
  it("lists Vin-Sol, Ruqaba, Vintage in that order", () => {
    expect(clients.map((c) => c.slug)).toEqual(["vin-sol", "ruqaba", "vintage"]);
    expect(clients.map((c) => c.number)).toEqual(["01", "02", "03"]);
  });

  it("links to the three live sites", () => {
    expect(clients.map((c) => c.url)).toEqual([
      "https://www.vin-sol.com/",
      "https://ruqaba.com/",
      "https://vamgltd.co.uk/",
    ]);
  });

  it("uses the exact verbs per client", () => {
    expect(bySlug("vin-sol").did).toMatch(/designed and built vin-sol\.com/i);
    expect(bySlug("ruqaba").did).toMatch(/HR and payroll/);
    expect(bySlug("ruqaba").did).toMatch(/Kyvani/);
    expect(bySlug("vintage").did).toMatch(/maintenance/i);
    expect(bySlug("vintage").did).not.toMatch(/designed|built/i);
  });

  it("gives every client concrete details of the work", () => {
    for (const c of clients) {
      expect(c.headline.length, c.slug).toBeGreaterThan(20);
      expect(c.details.length, c.slug).toBeGreaterThan(0);
      for (const d of c.details) expect(d.items.length, `${c.slug} ${d.title}`).toBeGreaterThanOrEqual(3);
    }
    expect(bySlug("ruqaba").details.map((d) => d.title)).toEqual(["Inside the HR system", "Inside the Kyvani store"]);
  });

  it("never makes the claims ruled out", () => {
    const all = JSON.stringify(clients);
    expect(all).not.toMatch(/GIFCO|Rabeeya|expense|Horquva Inc|Ashraf/i);
    expect(all).not.toMatch(/kyvani\.[a-z]/i);
    expect(bySlug("ruqaba").did).not.toMatch(/ruqaba\.com/);
  });

  it("keeps every string field inside each client's confirmed claims", () => {
    const strings = (c: (typeof clients)[number]) => {
      const { url, domain, ...rest } = c;
      void url;
      void domain;
      return JSON.stringify(rest);
    };
    expect(strings(bySlug("vintage"))).not.toMatch(/designed|built|develop/i);
    expect(strings(bySlug("ruqaba"))).not.toMatch(/ruqaba\.com/i);
    expect(JSON.stringify(bySlug("vin-sol"))).not.toMatch(
      /Laravel|PHP|React|Next\.js|Node|WordPress|Python|Django|Vue|Angular|OpenAI|GPT|Gemini|Claude|Groq|Llama/i,
    );
    // The incentive screen names claim types, which would hint at who the HR system is for.
    expect(strings(bySlug("ruqaba"))).not.toMatch(/claim|incentive breakdown|hrm-incentive/i);
  });

  it("keeps the page's own copy free of ruled-out claims", () => {
    const page = ["app/work/page.tsx", ...readdirSync(path.join(root, "components/work")).map((f) => `components/work/${f}`)]
      .map((f) => readFileSync(path.join(root, f), "utf8"))
      .join("\n");
    expect(page).not.toMatch(/GIFCO|Rabeeya|expense|Horquva Inc|kyvani\.[a-z]/i);
    expect(page).not.toMatch(banned);
    // Quotes reach the page only through visibleQuote, never c.quote directly.
    expect(page).not.toMatch(/c\.quote/);
  });

  // Owner confirmed approval for these on 2026-10-29. Update this list as more are approved.
  it("publishes only the approved quotes", () => {
    expect(clients.filter((c) => visibleQuote(c)).map((c) => c.slug)).toEqual(["ruqaba", "vintage"]);
    expect(visibleQuote(bySlug("ruqaba"))).toMatchObject({ name: "Aurangzeb Khan", role: "General Manager" });
    expect(visibleQuote(bySlug("vintage"))).toMatchObject({ name: "Mohammud Bin Zahir Minhas", role: "Director" });
    expect(visibleQuote(bySlug("vin-sol"))).toBeUndefined();
  });

  it("visibleQuote hides unapproved quotes", () => {
    const ruqaba = bySlug("ruqaba");
    expect(visibleQuote({ ...ruqaba, quote: { ...ruqaba.quote!, approved: false } })).toBeUndefined();
  });

  it("gives every client a showcase whose screens exist in /photos/work/", () => {
    for (const c of clients) {
      const screens = screensOf(c);
      expect(screens.length, c.slug).toBeGreaterThan(0);
      for (const s of screens) {
        expect(s.src, c.slug).toMatch(/^\/photos\/work\/.+\.webp$/);
        expect(() => readFileSync(path.join(root, "public", s.src)), s.src).not.toThrow();
        expect(s.alt.length, s.src).toBeGreaterThan(0);
        expect(s.width * s.height, s.src).toBeGreaterThan(0);
      }
      expect(c.showcase.caption.length, c.slug).toBeGreaterThan(0);
    }
    expect(screensOf(bySlug("ruqaba")).map((s) => s.src)).toContain("/photos/work/kyvani-home.webp");
  });

  it("contains no banned words", () => {
    expect(JSON.stringify(clients)).not.toMatch(banned);
  });
});
