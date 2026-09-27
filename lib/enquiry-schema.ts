import { z } from "zod";
import { budgetOptions, enquiryServiceOptions } from "@/content/site";

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120, "Keep your name under 120 characters"),
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  company: z.string().trim().max(160, "Keep the company name under 160 characters").optional(),
  service: z.enum(enquiryServiceOptions as [string, ...string[]], { error: "Choose a service" }),
  budget: z.enum(budgetOptions as [string, ...string[]], { error: "Choose a budget range" }),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more (at least 20 characters)")
    .max(5000, "Keep it under 5000 characters"),
  /** Honeypot: real people never see or fill this field. */
  website: z.string().optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;
