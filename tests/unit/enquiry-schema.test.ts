import { describe, it, expect } from "vitest";
import { enquirySchema } from "@/lib/enquiry-schema";

export const validEnquiry = {
  name: "Sara Ahmed",
  email: "sara@example.com",
  company: "Example Foods",
  service: "AI agents and chat automation",
  budget: "$5k–15k",
  message: "We want customers to order on WhatsApp and have it go into our POS.",
  website: "",
};

const fieldError = (input: unknown, field: string) => {
  const r = enquirySchema.safeParse(input);
  expect(r.success).toBe(false);
  if (!r.success) expect(r.error.issues.some((i) => i.path[0] === field)).toBe(true);
};

describe("enquirySchema", () => {
  it("accepts a valid enquiry", () => {
    expect(enquirySchema.safeParse(validEnquiry).success).toBe(true);
  });

  it("accepts a missing company", () => {
    const withoutCompany: Partial<typeof validEnquiry> = { ...validEnquiry };
    delete withoutCompany.company;
    expect(enquirySchema.safeParse(withoutCompany).success).toBe(true);
  });

  it("rejects an empty name", () => fieldError({ ...validEnquiry, name: "  " }, "name"));
  it("rejects a bad email", () => fieldError({ ...validEnquiry, email: "sara@" }, "email"));
  it("rejects an unknown service", () => fieldError({ ...validEnquiry, service: "Crypto" }, "service"));
  it("rejects an unknown budget", () => fieldError({ ...validEnquiry, budget: "$1m" }, "budget"));
  it("rejects a message under 20 characters", () => fieldError({ ...validEnquiry, message: "Too short" }, "message"));
  it("rejects a message over 5000 characters", () =>
    fieldError({ ...validEnquiry, message: "a".repeat(5001) }, "message"));

  it("keeps the honeypot value so the route can decide", () => {
    const r = enquirySchema.safeParse({ ...validEnquiry, website: "http://spam" });
    expect(r.success && r.data.website).toBe("http://spam");
  });
});
