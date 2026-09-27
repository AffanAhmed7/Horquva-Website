import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Hero } from "@/components/home/Hero";
import { ObaTeaser } from "@/components/home/ObaTeaser";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { ServiceCards } from "@/components/home/ServiceCards";
import { TeamStrip } from "@/components/home/TeamStrip";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";

export default function Home() {
  return (
    <>
      <Hero />

      <section
        className="relative isolate overflow-hidden bg-paper py-24 text-ink md:py-36"
        aria-labelledby="services-title"
      >
        {/* Warm bronze glow that pools behind the cards and fades out to the paper at the edges. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: [
              "radial-gradient(ellipse 65% 50% at 30% 68%, rgba(169,130,90,0.30), transparent 70%)",
              "radial-gradient(ellipse 55% 45% at 80% 55%, rgba(94,63,44,0.16), transparent 70%)",
              "linear-gradient(to bottom, transparent 15%, rgba(169,130,90,0.10) 55%, transparent 95%)",
            ].join(", "),
          }}
        />
        <ServiceCards
          services={services}
          allHref="/services"
          title={
            <RevealText as="h2" id="services-title" className="text-title-light">
              What we build
            </RevealText>
          }
        />
      </section>

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
