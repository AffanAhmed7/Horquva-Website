import type { Metadata } from "next";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI agents, knowledge assistants, document and vision AI, voice AI, automation, web engineering, WordPress, and data and analytics.",
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="What we build"
        lead={
          <p>
            Eight kinds of work, done by one team. Most projects combine two or three: an agent needs integrations, a
            portal needs data. We scope each one with a fixed price before we start.
          </p>
        }
      />
      <Section innerClassName="pb-28 md:pb-40">
        <ServiceIndex services={services} />
      </Section>
    </>
  );
}
