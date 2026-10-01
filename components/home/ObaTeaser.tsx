import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { HowItWorks } from "@/components/oba/HowItWorks";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const understand = ["Understand what you have.", "Understand what depends on it.", "Understand what changes."];

/**
 * OBA Core, straight after the hero: the promise, how it works step by step, and the line it all
 * comes down to. Each part makes its entrance in turn as it scrolls in.
 */
export function ObaTeaser() {
  return (
    <Section tone="ink" className="relative isolate overflow-hidden" innerClassName="py-28 md:py-40" aria-labelledby="oba-title">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
      />

      <div className="mx-auto max-w-4xl text-center">
        <RevealText as="h2" id="oba-title" className="text-hero mx-auto max-w-[20ch] text-paper">
          Before you change something important, know what it will affect.
        </RevealText>
        {/* Follows the headline's lines in. */}
        <Reveal delay={0.45}>
          <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[19px]">
            OBA Core, the product we&apos;re building, shows how an organisation&apos;s people, AI, systems, processes,
            knowledge and vendors are connected, and what happens when something changes.
          </p>
        </Reveal>
      </div>

      <HowItWorks className="mt-20 md:mt-28" />

      {/* What it comes down to, beat by beat. */}
      <div className="mt-24 border-t border-rule-dark pt-12 md:mt-32">
        <Reveal as="ul" stagger={0.14} className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {understand.map((u) => (
            <li key={u} className="font-display text-[20px] font-light leading-snug text-stone md:text-[22px]">
              {u}
            </li>
          ))}
          <li className="font-display text-[20px] leading-snug text-bronze md:text-[22px]">Know what to do.</li>
        </Reveal>
        <Reveal delay={0.5} className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-lg text-[15px] text-stone">
            OBA Core is in development, and we’re opening it to a small group of early teams.
          </p>
          <Button href="/oba-core" tone="ink">
            Explore OBA Core
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
