import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { StartProject } from "@/components/forms/StartProject";
import { Hero } from "@/components/home/Hero";
import { ObaTeaser } from "@/components/home/ObaTeaser";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { ServiceCards } from "@/components/home/ServiceCards";
import { TeamStrip } from "@/components/home/TeamStrip";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";
import { site } from "@/content/site";

// Tells Google which name to show for the site in search results. It must live on the home page.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.legalName,
  alternateName: [site.name, "horquva.com"],
  url: `${site.url}/`,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <ObaTeaser />

      <section id="services" className="bg-paper text-ink" data-tone="paper" aria-labelledby="services-title">
        <ServiceCards
          services={services}
          title={
            <RevealText as="h2" id="services-title" className="text-title-light">
              Our services
            </RevealText>
          }
        />
      </section>

      <ProcessSteps />
      <TeamStrip />

      <Section
        tone="ink"
        id="start"
        className="relative isolate overflow-hidden"
        innerClassName="py-24 md:py-36"
        aria-labelledby="start-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.2),transparent_75%)]"
        />
        <StartProject titleId="start-title">
          <EnquiryForm tone="ink" />
        </StartProject>
      </Section>
    </>
  );
}
