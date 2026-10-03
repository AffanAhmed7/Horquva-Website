import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { PersonPhoto } from "@/components/ui/PersonPhoto";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind Horquva: engineering, product, operations, security and business development.",
};

const onward = [
  { href: "/careers", title: "Work with us", body: "We'd like to hear from people who build software carefully." },
  { href: "/contact", title: "Start a project", body: "Tell us what you're trying to do. We reply within two working days." },
];

export default function TeamPage() {
  return (
    <>
      {/* Opening. */}
      <Section
        tone="ink"
        className="relative isolate overflow-hidden"
        innerClassName="pt-32 pb-24 text-center md:pt-44 md:pb-32"
        aria-labelledby="team-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
        />
        <RevealText as="h1" id="team-title" className="text-hero mx-auto max-w-[18ch] text-paper">
          The people doing the work
        </RevealText>
        <Reveal delay={0.35}>
          <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[20px]">
            A small team across engineering, product, operations, security and business development. The people you
            meet at the start are the people who build your project.
          </p>
        </Reveal>
      </Section>

      {/* Everyone. */}
      <Section innerClassName="py-24 md:py-32" aria-label="Team members">
        <Reveal as="ul" stagger={0.08} className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p) => (
            <li key={p.name} className="group">
              <PersonPhoto
                person={p}
                className="rounded-[1.25rem]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <h2 className="mt-6 font-display text-[22px] leading-tight">{p.name}</h2>
              <p className="mt-1 text-[15px] text-bronze-deep">{p.role}</p>
              <p className="mt-4 text-[16px] leading-[1.6] text-ink-soft">{p.bio}</p>
              {p.linkedin && (
                <p className="mt-4 text-[15px]">
                  <TextLink href={p.linkedin} external>
                    LinkedIn
                  </TextLink>
                </p>
              )}
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Where to next. */}
      <Section tone="ink" innerClassName="py-24 md:py-32" aria-label="Get in touch">
        <Reveal as="ul" stagger={0.12} className="grid gap-4 md:grid-cols-2">
          {onward.map((o) => (
            <li key={o.href}>
              <Link
                href={o.href}
                className="group flex h-full items-end justify-between gap-6 rounded-[1.25rem] bg-paper/[0.04] p-8 ring-1 ring-paper/10 transition-colors duration-500 hover:bg-paper/[0.08] md:p-10"
              >
                <span>
                  <span className="block font-display text-[28px] leading-tight text-paper md:text-[34px]">
                    {o.title}
                  </span>
                  <span className="mt-3 block max-w-sm text-[16px] leading-[1.55] text-paper/60">{o.body}</span>
                </span>
                <span
                  aria-hidden
                  className="text-[28px] text-bronze transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
