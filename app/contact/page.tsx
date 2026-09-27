import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell us what you're trying to build. We reply to every enquiry within two working days.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title="Start a project"
        lead={
          <p>
            Tell us what you&apos;re trying to do. We reply to every enquiry within two working days. You can also
            email{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline decoration-bronze underline-offset-[6px]">
              {site.email}
            </a>
            .
          </p>
        }
      />
      <Section innerClassName="pb-28 md:pb-40">
        <div className="border-t border-rule pt-12 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            <Suspense fallback={<EnquiryForm />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
