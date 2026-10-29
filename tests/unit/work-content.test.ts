import { describe, it, expect } from "vitest";
import { clients, visibleQuote } from "@/content/work";

const banned =
  /unlock|empower|seamless|cutting-edge|leverage|revolutioni[sz]e|transform your business|next-generation|supercharge/i;

const bySlug = (slug: string) => clients.find((c) => c.slug === slug)!;

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

  it("never makes the claims ruled out", () => {
    const all = JSON.stringify(clients);
    expect(all).not.toMatch(/GIFCO|Rabeeya|expense|Horquva Inc/i);
    expect(all).not.toMatch(/kyvani\.[a-z]/i);
    expect(JSON.stringify(bySlug("vin-sol"))).not.toMatch(/Laravel|PHP|React|Node|WordPress/i);
    expect(bySlug("ruqaba").did).not.toMatch(/ruqaba\.com/);
  });

  it("ships every quote unapproved", () => {
    for (const c of clients) expect(c.quote?.approved, c.slug).toBe(false);
    expect(bySlug("ruqaba").quote).toMatchObject({ name: "Aurangzeb Khan", role: "General Manager" });
    expect(bySlug("vintage").quote).toMatchObject({ name: "Mohammud Bin Zahir Minhas", role: "Director" });
  });

  it("visibleQuote hides drafts and shows approved quotes", () => {
    for (const c of clients) expect(visibleQuote(c), c.slug).toBeUndefined();
    const ruqaba = bySlug("ruqaba");
    const approved = { ...ruqaba, quote: { ...ruqaba.quote!, approved: true } };
    expect(visibleQuote(approved)?.name).toBe("Aurangzeb Khan");
  });

  it("keeps images in /photos/work/", () => {
    for (const c of clients) {
      if (!c.image) continue;
      expect(c.image.src, c.slug).toMatch(/^\/photos\/work\/.+\.webp$/);
      expect(c.image.alt.length, c.slug).toBeGreaterThan(0);
      expect(c.image.caption.length, c.slug).toBeGreaterThan(0);
    }
  });

  it("contains no banned words", () => {
    expect(JSON.stringify(clients)).not.toMatch(banned);
  });
});
