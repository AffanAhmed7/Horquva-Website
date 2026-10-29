import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { services } from "../../content/services";

const routes = [
  "/",
  ...services.map((s) => `/services/${s.slug}`),
  "/work",
  "/oba-core",
  "/approach",
  "/team",
  "/careers",
  "/contact",
  "/privacy",
];

test.use({ reducedMotion: "reduce" });

for (const route of routes) {
  test(`${route} renders one h1 and has no accessibility violations`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("work page names each client and links out safely", async ({ page, isMobile }) => {
  await page.goto("/work");
  const names = await page.locator("article h2").allTextContents();
  expect(names).toEqual(["Vin-Sol", "Ruqaba", "Vintage Claims Management"]);

  for (const [label, href] of [
    ["Visit vin-sol.com", "https://www.vin-sol.com/"],
    ["Visit ruqaba.com", "https://ruqaba.com/"],
    ["Visit vamgltd.co.uk", "https://vamgltd.co.uk/"],
  ]) {
    const link = page.getByRole("link", { name: label });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noreferrer/);
  }

  // Approved quotes show with their names; Vin-Sol's draft stays hidden.
  const text = await page.locator("main").innerText();
  expect(text).toContain("Aurangzeb Khan");
  expect(text).toContain("Mohammud Bin Zahir Minhas");
  expect(text).not.toContain("To be confirmed");
  expect(text).not.toContain("the AI assistant on it, and they automate");

  if (!isMobile) await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work");
});

test("unknown service returns 404", async ({ page }) => {
  const res = await page.goto("/services/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("mobile menu opens and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  // The menu fades out rather than unmounting: closed means inert (no focus, hidden from
  // assistive tech) and fully transparent.
  await expect(dialog).toHaveAttribute("inert", "");
  await expect(dialog).toHaveCSS("opacity", "0");
  await expect(toggle).toBeFocused();
});
