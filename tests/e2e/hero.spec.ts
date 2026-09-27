import { test, expect } from "@playwright/test";

test.describe("home hero", () => {
  test.skip(({ isMobile }) => isMobile, "wheel scrolling is desktop-only");

  test("header floats over the hero and turns solid once past it", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header).toHaveClass(/bg-transparent/);

    const heroHeight = await page.locator("[data-hero]").evaluate((el: HTMLElement) => el.offsetHeight);
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, heroHeight + 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(heroHeight);

    // Scrolling back up a little reveals the header, now solid.
    await page.mouse.wheel(0, -200);
    await expect(header).toHaveClass(/bg-paper/);
    await expect(header).toHaveClass(/translate-y-0/);
  });

  test("hero photo drifts with scroll (parallax)", async ({ page }) => {
    await page.goto("/");
    const media = page.locator("[data-hero] .will-change-transform");
    const translateY = () =>
      media.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);

    await expect.poll(translateY).toBe(0);
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 400);
    await expect.poll(translateY).toBeGreaterThan(40);
  });

  test("hero stays still under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("http://localhost:3100/");
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    const transform = await page
      .locator("[data-hero] .will-change-transform")
      .evaluate((el) => getComputedStyle(el).transform);
    expect(transform).toBe("none");
    await context.close();
  });
});
