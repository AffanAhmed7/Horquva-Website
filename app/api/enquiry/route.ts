import { z } from "zod";
import { enquirySchema } from "@/lib/enquiry-schema";
import { createSharedRateLimiter, getClientIp } from "@/lib/rate-limit";
import { sendEnquiry } from "@/lib/send-enquiry";

export const runtime = "nodejs";

const allow = createSharedRateLimiter({ prefix: "enquiry:limit", limit: 5, windowSeconds: 10 * 60 });

type Outcome = "sent" | "invalid" | "limited" | "failed";

export async function POST(request: Request) {
  const isForm = !(request.headers.get("content-type") ?? "").includes("application/json");
  const ip = getClientIp(request);

  const respond = (outcome: Outcome, errors?: Record<string, string[] | undefined>) => {
    if (isForm) {
      const query = outcome === "sent" ? "sent=1" : "error=1";
      return Response.redirect(new URL(`/contact?${query}`, request.url), 303);
    }
    const status = { sent: 200, invalid: 400, limited: 429, failed: 502 }[outcome];
    return Response.json(outcome === "sent" ? { ok: true } : { ok: false, errors }, { status });
  };

  if (!(await allow(ip))) return respond("limited");

  let body: unknown;
  try {
    body = isForm ? Object.fromEntries(await request.formData()) : await request.json();
  } catch {
    return respond("invalid");
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return respond("invalid", z.flattenError(parsed.error).fieldErrors);

  // Bots fill the hidden field. Tell them it worked and drop the message.
  if (parsed.data.website) return respond("sent");

  try {
    await sendEnquiry(parsed.data);
  } catch (err) {
    console.error("Enquiry send failed", err);
    return respond("failed");
  }
  return respond("sent");
}
