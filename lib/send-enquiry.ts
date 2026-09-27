import { Resend } from "resend";
import type { Enquiry } from "@/lib/enquiry-schema";

export async function sendEnquiry(e: Enquiry): Promise<void> {
  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) {
    throw new Error("Enquiry email is not configured");
  }

  const text = [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    `Company: ${e.company || "—"}`,
    `Service: ${e.service}`,
    `Budget: ${e.budget}`,
    "",
    e.message,
  ].join("\n");

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: ENQUIRY_FROM_EMAIL,
    to: ENQUIRY_TO_EMAIL,
    replyTo: e.email,
    subject: `New enquiry: ${e.service} — ${e.name}`,
    text,
  });
  if (error) throw new Error(error.message);
}
