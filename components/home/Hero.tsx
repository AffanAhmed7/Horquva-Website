import { RevealText } from "@/components/motion/RevealText";
import { RevealImage } from "@/components/motion/RevealImage";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import manifest from "@/content/photo-manifest.json";

export function Hero() {
  return (
    <>
      <Section innerClassName="pt-14 pb-14 md:pt-24 md:pb-20">
        <RevealText as="h1" className="text-display max-w-[17ch]">
          We build the software and AI systems businesses depend on.
        </RevealText>
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
          <p className="text-[19px] leading-[1.5] text-ink-soft md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
            Horquva is an engineering company in Karachi. We take on AI, automation, web and data work for
            clients, and we&apos;re building OBA Core, a product that shows organisations what a change will affect
            before they make it.
          </p>
          <div className="flex items-end gap-8 text-[17px] md:col-span-12 md:col-start-7 lg:col-span-5 lg:col-start-7">
            <TextLink href="/contact">Start a project</TextLink>
            <TextLink href="/services">See what we build</TextLink>
          </div>
        </div>
      </Section>
      <RevealImage>
        <Photo
          src="/photos/hero.jpg"
          alt={manifest.photos.hero.alt}
          ratio="16/7"
          priority
          className="max-md:aspect-[4/5]!"
        />
      </RevealImage>
    </>
  );
}
