import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StartProject } from "@/components/forms/StartProject";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell us what you're trying to build. We reply to every enquiry within two working days.",
};

export default function ContactPage() {
  return (
    <Section
      tone="ink"
      className="relative isolate overflow-hidden"
      innerClassName="pt-32 pb-24 md:pt-40 md:pb-32"
      aria-labelledby="contact-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
      />
      <StartProject as="h1" titleId="contact-title">
        <Suspense fallback={<EnquiryForm tone="ink" />}>
          <ContactForm tone="ink" />
        </Suspense>
      </StartProject>
    </Section>
  );
}
