import { RevealText } from "@/components/motion/RevealText";
import { RevealImage } from "@/components/motion/RevealImage";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import manifest from "@/content/photo-manifest.json";

export function ObaTeaser() {
  return (
    <Section innerClassName="py-24 md:py-36">
      <h2 className="text-display">
        <RevealText as="span" className="block">
          What changed?
        </RevealText>
        <RevealText as="span" className="block" delay={0.1}>
          What does it affect?
        </RevealText>
        <RevealText as="span" className="block text-bronze-deep" delay={0.2}>
          What should we do?
        </RevealText>
      </h2>
      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
        <div className="max-w-lg space-y-6 text-[18px] text-ink-soft md:col-span-5">
          <p>
            These are the three questions OBA Core answers, the product we&apos;re building alongside our client work.
          </p>
          <p>
            It connects the people, AI, systems, processes, knowledge and vendors behind an organisation&apos;s most
            important work, and shows what a change will affect before anyone makes it.
          </p>
          <p className="text-ink">
            <TextLink href="/oba-core">More about OBA Core</TextLink>
          </p>
        </div>
        <RevealImage className="md:col-span-6 md:col-start-7">
          <Photo src="/photos/oba.jpg" alt={manifest.photos.oba.alt} ratio="4/3" sizes="(min-width: 768px) 50vw, 100vw" />
        </RevealImage>
      </div>
    </Section>
  );
}
