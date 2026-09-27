import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/send-enquiry", () => ({ sendEnquiry: vi.fn() }));

import { sendEnquiry } from "@/lib/send-enquiry";
import { createRateLimiter } from "@/lib/rate-limit";

const valid = {
  name: "Sara Ahmed",
  email: "sara@example.com",
  company: "",
  service: "WordPress development",
  budget: "Not sure yet",
  message: "Our WooCommerce store is slow and we need it fixed properly.",
  website: "",
};

let ipCounter = 0;
const json = (body: unknown, ip = `10.0.0.${++ipCounter}`) =>
  new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

async function post(req: Request) {
  const { POST } = await import("@/app/api/enquiry/route");
  return POST(req);
}

beforeEach(() => {
  vi.mocked(sendEnquiry).mockReset();
  vi.mocked(sendEnquiry).mockResolvedValue(undefined);
});

describe("POST /api/enquiry", () => {
  it("sends a valid enquiry and returns 200", async () => {
    const res = await post(json(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendEnquiry).toHaveBeenCalledOnce();
  });

  it("returns 400 with field errors for invalid input", async () => {
    const res = await post(json({ ...valid, email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.email).toBeDefined();
    expect(sendEnquiry).not.toHaveBeenCalled();
  });

  it("pretends to succeed when the honeypot is filled", async () => {
    const res = await post(json({ ...valid, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(sendEnquiry).not.toHaveBeenCalled();
  });

  it("returns 502 when sending fails", async () => {
    vi.mocked(sendEnquiry).mockRejectedValueOnce(new Error("resend down"));
    const res = await post(json(valid));
    expect(res.status).toBe(502);
  });

  it("returns 429 after 5 requests from one IP", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await post(json(valid, "203.0.113.9"))).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("redirects form posts to /contact?sent=1", async () => {
    const res = await post(
      new Request("http://localhost/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "198.51.100.1" },
        body: new URLSearchParams(valid).toString(),
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost/contact?sent=1");
  });

  it("redirects invalid form posts to /contact?error=1", async () => {
    const res = await post(
      new Request("http://localhost/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "198.51.100.2" },
        body: new URLSearchParams({ ...valid, email: "bad" }).toString(),
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost/contact?error=1");
  });
});

describe("createRateLimiter", () => {
  it("allows up to the limit within the window, then resets after it", () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 10)).toBe(true);
    expect(allow("a", 20)).toBe(false);
    expect(allow("b", 20)).toBe(true);
    expect(allow("a", 1011)).toBe(true);
  });
});
