import type { Metadata } from "next";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Roadmap } from "@/components/oba/Roadmap";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import manifest from "@/content/photo-manifest.json";

export const metadata: Metadata = {
  title: "OBA Core",
  description:
    "OBA Core shows how an organisation's people, AI, systems, processes, knowledge and vendors are connected, and what happens when something changes.",
};

const connects = ["People", "AI agents and models", "Systems", "Processes", "Knowledge", "Vendors"];

const sectors = [
  {
    title: "In technology companies",
    body: "Tech teams run on people, software, AI agents, models, vendors and workflows. When an engineer leaves or a model is replaced, the effects are often discovered late. OBA Core shows what that person owns, which agents and workflows depend on them, where there is no backup, and what happens if someone else, or another model, takes over.",
    example:
      "A company wants to replace an AI model. OBA Core shows which agents and workflows use it and what is exposed, and lets the team test another model first.",
  },
  {
    title: "In healthcare",
    body: "Hospitals depend on doctors, nurses, administrators, software, medical systems and vendors, and critical work often sits with one person or one system. OBA Core shows which processes depend on a single specialist, which systems support critical work, and what is affected if a person leaves or a system is replaced.",
    example:
      "A hospital plans to replace a system used by several departments. OBA Core shows which teams and processes depend on it and lets leadership test the change first. It supports operations; it does not make medical decisions.",
  },
];

const outcomes = [
  "A clear view of who owns what, and what depends on it",
  "Early visibility of single points of failure",
  "The ability to test a change before it happens",
  "Evidence instead of assumptions when decisions are made",
  "Less lost knowledge when people or systems change",
];

export default function ObaCorePage() {
  return (
    <>
      <Section innerClassName="pt-14 pb-16 md:pt-24 md:pb-24">
        <RevealText as="h1" className="text-display max-w-[18ch]">
          Before you change something important, know what it will affect.
        </RevealText>
        <div className="mt-12 grid md:mt-16 md:grid-cols-12">
          <div className="space-y-5 text-[19px] leading-[1.5] text-ink-soft md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
            <p>
              Information about how an organisation really works is scattered across HR systems, project tools,
              documents and people&apos;s heads. OBA Core, the product we&apos;re building at Horquva, brings the important pieces together and shows the evidence
              behind them.
            </p>
            <p>It&apos;s in development now.</p>
          </div>
        </div>
      </Section>

      <RevealImage>
        <Photo src="/photos/oba.jpg" alt={manifest.photos.oba.alt} ratio="16/7" priority className="max-md:aspect-[4/3]!" />
      </RevealImage>

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
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <p className="text-[19px] leading-[1.5] text-ink-soft md:col-span-4">
            OBA Core answers these three questions by mapping how the pieces of an organisation connect:
          </p>
          <ul className="grid grid-cols-2 gap-x-8 md:col-span-7 md:col-start-6 md:grid-cols-3">
            {connects.map((c) => (
              <li key={c} className="border-t border-rule py-4 text-[19px]">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="roadmap-title">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
          <RevealText as="h2" id="roadmap-title" className="text-title md:col-span-6">
            Where it&apos;s going
          </RevealText>
          <p className="text-[19px] leading-[1.5] text-stone md:col-span-5 md:col-start-8 md:self-end">
            OBA Core is being built in five stages, each one useful on its own.
          </p>
        </div>
        <Roadmap />
      </Section>

      <Section innerClassName="py-24 md:py-36" aria-labelledby="sectors-title">
        <RevealText as="h2" id="sectors-title" className="text-title max-w-[14ch]">
          Where it helps
        </RevealText>
        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-12">
          {sectors.map((s) => (
            <article key={s.title} className="border-t border-rule pt-8">
              <h3 className="text-heading">{s.title}</h3>
              <p className="mt-6 text-[18px] text-ink-soft">{s.body}</p>
              <p className="mt-6 border-l-2 border-bronze pl-5 text-[18px]">{s.example}</p>
            </article>
          ))}
        </div>
        <p className="mt-16 max-w-3xl text-[18px] text-ink-soft">
          The same approach applies to universities, government, banking, manufacturing, energy and large enterprises:
          anywhere important work depends on people, systems and vendors that can change.
        </p>
      </Section>

      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="outcomes-title">
        <div className="grid gap-12 md:grid-cols-12">
          <RevealText as="h2" id="outcomes-title" className="text-title md:col-span-5">
            What organisations get
          </RevealText>
          <ul className="md:col-span-7">
            {outcomes.map((o) => (
              <li key={o} className="border-t border-rule-dark py-5 text-[20px] leading-snug last:border-b">
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-8 border-t border-rule-dark pt-10">
          <p className="max-w-xl text-stone">
            The examples on this page show the intended product capability. OBA Core is in development.
          </p>
          <Button href={`/contact?service=${encodeURIComponent("OBA Core")}`} tone="ink">
            Talk to us about OBA Core
          </Button>
        </div>
      </Section>
    </>
  );
}
