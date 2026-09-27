import type { Metadata } from "next";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { processSteps, workingTerms } from "@/content/process";
import manifest from "@/content/photo-manifest.json";

export const metadata: Metadata = {
  title: "Approach",
  description: "How Horquva runs a project: discover, prototype, build and support, with a fixed scope and price up front.",
};

const principles = [
  {
    title: "Working software early",
    body: "We'd rather show you something that runs on your data in week two than a slide deck in week six. Early prototypes surface the hard questions while they're still cheap to answer.",
  },
  {
    title: "Built to be relied on",
    body: "Permissions, error handling, tests, monitoring and documentation are part of the job, not extras. We build systems your team can depend on after we've handed them over.",
  },
  {
    title: "No lock-in",
    body: "You own the code, the data and the accounts. Everything is documented so your team, or another company, can pick it up.",
  },
  {
    title: "Honest about AI",
    body: "If a rule-based script solves the problem more reliably than a model, we'll tell you. Where we do use AI, we measure how well it works before it goes live.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <PageIntro
        title="How we work"
        lead={
          <p>
            Every project runs the same way, from a two-week automation to a six-month platform. You always know
            what&apos;s being built, what it costs and what happens next.
          </p>
        }
      />

      <RevealImage>
        <Photo src="/photos/approach.jpg" alt={manifest.photos.approach.alt} ratio="16/7" priority className="max-md:aspect-[4/3]!" />
      </RevealImage>

      <Section innerClassName="py-24 md:py-36">
        <ol>
          {processSteps.map((step) => (
            <li key={step.title} className="grid gap-6 border-t border-rule py-12 md:grid-cols-12 md:py-16">
              <p className="text-[15px] text-bronze-deep tabular-nums md:col-span-1">{step.number}</p>
              <h2 className="text-title md:col-span-5">{step.title}</h2>
              <p className="text-[19px] leading-[1.5] text-ink-soft md:col-span-5 md:col-start-8">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="principles-title">
        <RevealText as="h2" id="principles-title" className="text-title">
          What we hold to
        </RevealText>
        <div className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {principles.map((p) => (
            <article key={p.title} className="border-t border-rule-dark pt-6">
              <h3 className="text-[26px] leading-tight">{p.title}</h3>
              <p className="mt-4 text-[18px] text-stone">{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section innerClassName="py-24 md:py-36" aria-labelledby="terms-title">
        <div className="grid gap-12 md:grid-cols-12">
          <RevealText as="h2" id="terms-title" className="text-title md:col-span-5">
            Working terms
          </RevealText>
          <ul className="md:col-span-7">
            {workingTerms.map((t) => (
              <li key={t} className="border-t border-rule py-5 text-[20px] last:border-b">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-20">
          <Button href="/contact">Start a project</Button>
        </div>
      </Section>
    </>
  );
}
