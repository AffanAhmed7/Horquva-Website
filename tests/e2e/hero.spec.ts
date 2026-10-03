import { test, expect } from "@playwright/test";

test.describe("home hero", () => {
  test.skip(({ isMobile }) => isMobile, "wheel scrolling is desktop-only");

  test("header stays put: clear at the top, frosted once scrolled, dark glass over light sections", async ({ page }) => {
    await page.goto("/");
    // The site header; the Woba chat panel has a <header> of its own.
    const header = page.locator("header[data-surface]");
    await expect(header).toHaveClass(/bg-transparent/);
    await expect(header).toHaveAttribute("data-surface", "dark");

    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 200);
    await expect(header).toHaveClass(/backdrop-blur-md/);
    await expect(header).toHaveAttribute("data-surface", "dark");

    // A dark section follows the hero, so scroll until the light services section is under the header.
    const servicesTop = await page.locator("#services").evaluate((el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY);
    await page.mouse.wheel(0, servicesTop + 200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(servicesTop);
    // The header keeps light text everywhere; over paper it turns to dark frosted glass so that stays readable.
    await expect(header).toHaveAttribute("data-surface", "dark");
    await expect(header).toHaveClass(/bg-ink\/80/);
    // Sticky: still pinned to the top of the viewport after scrolling down.
    expect((await header.boundingBox())?.y).toBe(0);
  });

  test("hero photo drifts with scroll (parallax)", async ({ page }) => {
    await page.goto("/");
    const media = page.locator("[data-hero-scroll]");
    const translateY = () =>
      media.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);

    await expect.poll(translateY).toBe(0);
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 400);
    await expect.poll(translateY).toBeGreaterThan(40);
  });

  test("hero photo shifts against the pointer", async ({ page }) => {
    await page.goto("/");
    const layer = page.locator("[data-hero-pointer]");
    const translateX = () => layer.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
    await page.mouse.move(700, 450);
    await page.mouse.move(1200, 450, { steps: 5 });
    // Cursor to the right, photo drifts left.
    await expect.poll(translateX).toBeLessThan(-5);
  });

  test("hero stays still under reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("http://localhost:3100/");
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    const transform = await page
      .locator("[data-hero-scroll]")
      .evaluate((el) => getComputedStyle(el).transform);
    expect(transform).toBe("none");
    await context.close();
  });
});
