import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("empty submit shows field errors and sends nothing", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/enquiry", (route) => {
    requests++;
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Enter your name")).toBeVisible();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Choose a service")).toHaveCount(2); // placeholder option + error
  await expect(page.getByText("Choose a budget range")).toBeVisible();
  expect(requests).toBe(0);
});

test("valid submit shows the confirmation", async ({ page }) => {
  await page.route("**/api/enquiry", (route) => route.fulfill({ json: { ok: true } }));
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Sara Ahmed");
  await page.getByLabel("Email").fill("sara@example.com");
  await page.getByLabel("What do you need?").selectOption("WordPress development");
  await page.getByLabel("Budget").selectOption("$2k–5k");
  await page.getByLabel("About the project").fill("Our WooCommerce store takes eight seconds to load on mobile.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Thanks, Sara.");
});

test("server errors are shown next to the right field", async ({ page }) => {
  await page.route("**/api/enquiry", (route) =>
    route.fulfill({ status: 400, json: { ok: false, errors: { email: ["That address bounced"] } } }),
  );
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Sara Ahmed");
  await page.getByLabel("Email").fill("sara@example.com");
  await page.getByLabel("What do you need?").selectOption("Voice AI");
  await page.getByLabel("Budget").selectOption("Not sure yet");
  await page.getByLabel("About the project").fill("We want our call recordings transcribed and searchable.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("That address bounced")).toBeVisible();
});

test("OBA Core link preselects the service", async ({ page }) => {
  await page.goto(`/contact?service=${encodeURIComponent("OBA Core")}`);
  await expect(page.getByLabel("What do you need?")).toHaveValue("OBA Core");
});
