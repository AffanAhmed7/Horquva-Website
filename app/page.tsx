import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Hero } from "@/components/home/Hero";
import { ObaTeaser } from "@/components/home/ObaTeaser";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { TeamStrip } from "@/components/home/TeamStrip";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";

export default function Home() {
  return (
    <>
      <Hero />

      <Section innerClassName="py-24 md:py-36" aria-labelledby="services-title">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-12">
          <RevealText as="h2" id="services-title" className="text-title md:col-span-6">
            What we build
          </RevealText>
          <p className="text-[19px] leading-[1.5] text-ink-soft md:col-span-5 md:col-start-8 md:self-end">
            Eight kinds of work, one team. Most projects combine two or three of them.
          </p>
        </div>
        <ServiceIndex services={services} />
      </Section>

      <ProcessSteps />
      <ObaTeaser />
      <TeamStrip />

      <Section tone="ink" id="start" innerClassName="py-24 md:py-36" aria-labelledby="start-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealText as="h2" id="start-title" className="text-title">
              Start a project
            </RevealText>
            <p className="mt-6 max-w-sm text-[18px] text-stone">
              Tell us what you&apos;re trying to do. We reply to every enquiry within two working days.
            </p>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm tone="ink" />
          </div>
        </div>
      </Section>
    </>
  );
}
