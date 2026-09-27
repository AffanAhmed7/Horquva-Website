import type { Metadata } from "next";
import { RevealImage } from "@/components/motion/RevealImage";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import manifest from "@/content/photo-manifest.json";

export const metadata: Metadata = {
  title: "Careers",
  description: "Work with Horquva on AI, automation, web and data systems.",
};

export default function CareersPage() {
  return (
    <>
      <PageIntro
        title="Work with us"
        lead={
          <>
            <p>
              We don&apos;t have open roles right now. If you build software carefully and want to work on AI,
              automation, web or data systems for real businesses, we&apos;d still like to hear from you.
            </p>
            <p className="mt-5 text-ink">
              Send your CV and a line about what you&apos;d like to work on to{" "}
              <a href={`mailto:${site.email}`} className="underline decoration-bronze underline-offset-[6px]">
                {site.email}
              </a>
              .
            </p>
          </>
        }
      />
      <Section innerClassName="pb-28 md:pb-40">
        <RevealImage>
          <Photo src="/photos/careers.jpg" alt={manifest.photos.careers.alt} ratio="21/8" className="max-md:aspect-[4/3]!" />
        </RevealImage>
      </Section>
    </>
  );
}
