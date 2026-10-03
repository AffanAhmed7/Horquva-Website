import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { principles, processSteps, workingTerms } from "@/content/process";
import manifest from "@/content/photo-manifest.json";

export const metadata: Metadata = {
  title: "Approach",
  description: "How Horquva runs a project: discover, prototype, build and support, with a fixed scope and price up front.",
};

/** What each step leaves you with, in the order of processSteps. */
const deliverables: Record<string, string> = {
  Discover: "A written scope and a fixed price",
  Prototype: "A working version on your real data",
  Build: "Weekly demos and a shared board",
  Support: "Documentation, training and the code",
};

export default function ApproachPage() {
  return (
    <>
      {/* Opening. */}
      <Section
        tone="ink"
        className="relative isolate overflow-hidden"
        innerClassName="pt-32 pb-24 md:pt-44 md:pb-32"
        aria-labelledby="approach-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
        />
        <div className="text-center">
          <RevealText as="h1" id="approach-title" className="text-hero mx-auto max-w-[16ch] text-paper">
            How we work
          </RevealText>
          <Reveal delay={0.35}>
            <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[20px]">
              Every project runs the same way, from a two-week automation to a six-month platform. You always know
              what&apos;s being built, what it costs and what happens next.
            </p>
          </Reveal>
        </div>
        <RevealImage parallax className="mt-16 overflow-hidden rounded-[1.25rem] md:mt-24">
          <Photo src="/photos/approach.jpg" alt={manifest.photos.approach.alt} ratio="21/9" priority className="max-md:aspect-[4/3]!" />
        </RevealImage>
      </Section>

      {/* The four steps, as a timeline. */}
      <Section innerClassName="py-24 md:py-36" aria-labelledby="steps-title">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <RevealText as="h2" id="steps-title" className="text-title-light">
                Four steps, every project
              </RevealText>
              <Reveal delay={0.3}>
                <p className="mt-6 max-w-sm text-[17px] leading-[1.6] text-ink-soft">
                  Each step ends with something you can see and use, so decisions are made on real work.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal as="ol" stagger={0.12} className="relative md:col-span-7 md:col-start-6">
            {processSteps.map((step, i) => (
              <li key={step.title} className="relative pb-14 pl-10 last:pb-0 md:pb-16 md:pl-14">
                {/* The line runs down to the next step; the last one ends at its marker. */}
                {i < processSteps.length - 1 && (
                  <span aria-hidden className="absolute bottom-0 left-[5px] top-3 w-px bg-rule" />
                )}
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.55rem] h-[11px] w-[11px] rounded-full bg-bronze ring-4 ring-paper"
                />
                <h3 className="font-display text-[30px] font-light leading-tight md:text-[38px]">{step.title}</h3>
                <p className="mt-4 max-w-xl text-[18px] leading-[1.6] text-ink-soft">{step.body}</p>
                {deliverables[step.title] && (
                  <p className="mt-5 text-[15px] text-ink">
                    <span className="text-bronze-deep">What you get: </span>
                    {deliverables[step.title]}
                  </p>
                )}
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Principles. */}
      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="principles-title">
        <RevealText as="h2" id="principles-title" className="text-title-light max-w-[16ch]">
          What we hold to
        </RevealText>
        <Reveal as="div" stagger={0.12} className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2">
          {principles.map((p) => (
            <article key={p.title} className="rounded-[1.25rem] bg-paper/[0.04] p-8 ring-1 ring-paper/10 md:p-10">
              <h3 className="font-display text-[24px] leading-tight text-paper md:text-[28px]">{p.title}</h3>
              <p className="mt-4 text-[17px] leading-[1.6] text-paper/60">{p.body}</p>
            </article>
          ))}
        </Reveal>
      </Section>

      {/* Working terms, and the way in. */}
      <Section innerClassName="py-24 md:py-36" aria-labelledby="terms-title">
        <RevealText as="h2" id="terms-title" className="text-title-light mx-auto max-w-[18ch] text-center">
          Working terms
        </RevealText>
        <Reveal
          as="ul"
          stagger={0.1}
          className="mt-14 grid gap-px overflow-hidden rounded-[1.25rem] bg-rule ring-1 ring-rule sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
        >
          {workingTerms.map((t) => (
            <li key={t} className="bg-[#FBF9F5] p-8 font-display text-[20px] leading-snug md:text-[22px]">
              {t}
            </li>
          ))}
        </Reveal>
        <Reveal delay={0.3} className="mt-16 flex flex-col items-center gap-4 text-center">
          <Button href="/contact">Start a project</Button>
          <p className="text-[15px] text-ink-soft">We reply to every enquiry within two working days.</p>
        </Reveal>
      </Section>
    </>
  );
}
