import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { ConnectsGrid } from "@/components/oba/ConnectsGrid";
import { HowItWorks } from "@/components/oba/HowItWorks";
import { Roadmap } from "@/components/oba/Roadmap";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "OBA Core",
  description:
    "OBA Core shows how an organisation's people, AI, systems, processes, knowledge and vendors are connected, and what happens when something changes.",
};

const enquiryHref = `/contact?service=${encodeURIComponent("OBA Core")}`;

const problems = [
  {
    title: "Scattered",
    body: "How work really gets done is spread across HR systems, project tools, documents and people's heads. No one place shows the whole picture.",
  },
  {
    title: "Resting on one person",
    body: "Critical work often sits with one specialist or one system, with no backup, and nobody notices until they're gone.",
  },
  {
    title: "Found out too late",
    body: "When someone leaves, a vendor changes or a model is replaced, the knock-on effects usually surface after the fact.",
  },
];

const questions = [
  {
    q: "What changed?",
    a: "OBA Core builds a live picture from the systems you already use, so a change to a person, an agent, a system or a vendor shows up as it happens, with the evidence behind it.",
  },
  {
    q: "What does it affect?",
    a: "It follows the change through every dependency: the processes, agents and people downstream, where there's no backup, and how the organisation's health score moves.",
  },
  {
    q: "What should we do?",
    a: "Test the options before acting. Ask “what if?”, compare scenarios safely, and get ranked recommendations with the reasoning shown, not just a verdict.",
  },
];

const sectors = [
  {
    title: "Technology companies",
    body: "Tech teams run on people, software, AI agents, models, vendors and workflows. When an engineer leaves or a model is replaced, the effects are often discovered late. OBA Core shows what that person owns, which agents and workflows depend on them, where there is no backup, and what happens if someone else, or another model, takes over.",
    example:
      "A company wants to replace an AI model. OBA Core shows which agents and workflows use it and what is exposed, and lets the team test another model first.",
    outcome: "Fewer surprises, safer changes, clearer planning.",
  },
  {
    title: "Healthcare",
    body: "Hospitals depend on doctors, nurses, administrators, software, medical systems and vendors, and critical work often sits with one person or one system. OBA Core shows which processes depend on a single specialist, which systems support critical work, and what is affected if a person leaves or a system is replaced.",
    example:
      "A hospital plans to replace a system used by several departments. OBA Core shows which teams and processes depend on it and lets leadership test the change first.",
    outcome: "Better preparation and continuity. OBA Core supports operations; it does not make medical decisions.",
  },
  {
    title: "Education and beyond",
    body: "The same approach works anywhere important work depends on people, systems and vendors that can change: universities, government, banking, manufacturing, energy and large enterprises.",
    example: "A university finds which courses depend on a single specialist, and plans cover before anyone leaves.",
    outcome: "Continuity that doesn't rest on one person.",
  },
];

export default function ObaCorePage() {
  return (
    <>
      {/* Opening. */}
      <Section tone="ink" className="relative isolate overflow-hidden" innerClassName="pt-32 pb-24 md:pt-44 md:pb-36">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
        />
        <div className="text-center">
          <RevealText as="h1" className="text-hero mx-auto max-w-[20ch] text-paper">
            Before you change something important, know what it will affect.
          </RevealText>
          <Reveal delay={0.45}>
            <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[20px]">
              OBA Core is the product we&apos;re building at Horquva. It shows how an organisation&apos;s people, AI,
              systems, processes, knowledge and vendors are connected, and what happens when something changes.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={enquiryHref} tone="ink">
                Talk to us about OBA Core
              </Button>
              <Button href="#how" variant="glass" tone="ink">
                See how it works
              </Button>
            </div>
          </Reveal>
        </div>

        <HowItWorks className="mt-20 md:mt-28" />
      </Section>

      {/* The problem. */}
      <Section innerClassName="py-24 md:py-32" aria-label="The problem">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[21px] leading-[1.5] text-ink md:text-[26px]">
              The process nobody wrote down. The AI agent nobody owns. The vendor three teams quietly depend on. The
              person who has been there nine years and just knows.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
              When they leave, it leaves. When something changes, nobody notices until it breaks.
            </p>
          </Reveal>
          <Reveal as="dl" stagger={0.1} className="mt-14 border-t border-rule">
            {problems.map((p) => (
              <div key={p.title} className="border-b border-rule py-6">
                <dt className="font-medium">{p.title}</dt>
                <dd className="mx-auto mt-1.5 max-w-xl leading-[1.6] text-ink-soft">{p.body}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* What it connects. */}
      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="connects-title">
        <RevealText as="h2" id="connects-title" className="text-title-light mx-auto max-w-[22ch] text-center">
          Your whole organization. Finally visible.
        </RevealText>
        <ConnectsGrid />
      </Section>

      {/* How it answers the three questions. */}
      <Section id="how" className="scroll-mt-20" innerClassName="py-24 md:py-36" aria-labelledby="how-title">
        <RevealText as="h2" id="how-title" className="text-title-light max-w-[18ch]">
          Three questions, answered with evidence.
        </RevealText>
        <Reveal as="ol" stagger={0.14} className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {questions.map((q) => (
            <li key={q.q} className="flex flex-col border-t border-rule pt-8">
              <h3 className="font-display text-[28px] font-light leading-tight md:text-[32px]">{q.q}</h3>
              <p className="mt-5 text-[16px] leading-[1.6] text-ink-soft">{q.a}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Roadmap. */}
      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="roadmap-title">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
          <RevealText as="h2" id="roadmap-title" className="text-title-light md:col-span-6">
            Where it&apos;s going
          </RevealText>
          <Reveal delay={0.3} className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-[18px] leading-[1.6] text-stone">
              OBA Core is being built in five stages, each one useful on its own.
            </p>
          </Reveal>
        </div>
        <Roadmap tone="ink" />
      </Section>

      {/* Where it helps. */}
      <Section innerClassName="py-24 md:py-36" aria-labelledby="sectors-title">
        <RevealText as="h2" id="sectors-title" className="text-title-light max-w-[16ch]">
          Where it helps
        </RevealText>
        <Reveal as="div" stagger={0.14} className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3">
          {sectors.map((s) => (
            <article key={s.title} className="flex flex-col rounded-[1.25rem] bg-[#FBF9F5] p-8 ring-1 ring-rule">
              <h3 className="font-display text-[24px] leading-tight">{s.title}</h3>
              <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">{s.body}</p>
              <p className="mt-6 border-l-2 border-bronze pl-4 text-[16px] leading-[1.55]">{s.example}</p>
              <p className="mt-auto pt-6 text-[14px] text-bronze-deep">{s.outcome}</p>
            </article>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
