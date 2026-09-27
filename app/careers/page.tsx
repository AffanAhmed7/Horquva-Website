import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { principles } from "@/content/process";
import { services } from "@/content/services";
import { site } from "@/content/site";
import manifest from "@/content/photo-manifest.json";

export const metadata: Metadata = {
  title: "Careers",
  description: "Work with Horquva on AI, automation, web and data systems.",
};

const applyHref = `mailto:${site.email}?subject=${encodeURIComponent("Working at Horquva")}`;

export default function CareersPage() {
  return (
    <>
      {/* Opening. */}
      <Section
        tone="ink"
        className="relative isolate overflow-hidden"
        innerClassName="pt-32 pb-24 md:pt-44 md:pb-32"
        aria-labelledby="careers-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
        />
        <div className="text-center">
          <RevealText as="h1" id="careers-title" className="text-hero mx-auto max-w-[16ch] text-paper">
            Work with us
          </RevealText>
          <Reveal delay={0.35}>
            <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[20px]">
              We don&apos;t have open roles right now. If you build software carefully and want to work on AI,
              automation, web or data systems for real businesses, we&apos;d still like to hear from you.
            </p>
            <div className="mt-10 flex justify-center">
              <Button href={applyHref} tone="ink">
                Send us your CV
              </Button>
            </div>
          </Reveal>
        </div>
        <RevealImage parallax className="mt-16 overflow-hidden rounded-[1.25rem] md:mt-24">
          <Photo src="/photos/careers.jpg" alt={manifest.photos.careers.alt} ratio="21/9" priority className="max-md:aspect-[4/3]!" />
        </RevealImage>
      </Section>

      {/* The work. */}
      <Section innerClassName="py-24 md:py-36" aria-labelledby="work-title">
        <div className="grid gap-10 md:grid-cols-12">
          <RevealText as="h2" id="work-title" className="text-title-light md:col-span-6">
            What you&apos;d work on
          </RevealText>
          <Reveal delay={0.3} className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-[18px] leading-[1.6] text-ink-soft">
              Client projects across everything we build, alongside OBA Core, the product we&apos;re building
              ourselves.
            </p>
          </Reveal>
        </div>
        <Reveal
          as="ul"
          stagger={0.06}
          className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] bg-rule ring-1 ring-rule sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
        >
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col bg-[#FBF9F5] p-7 transition-colors duration-500 hover:bg-paper"
              >
                <span className="font-display text-[20px] leading-tight">{s.name}</span>
                <span className="mt-3 text-[15px] leading-[1.55] text-ink-soft">{s.summary}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/oba-core"
              className="group flex h-full flex-col bg-ink p-7 text-paper transition-colors duration-500 hover:bg-[#1d1915]"
            >
              <span className="font-display text-[20px] leading-tight">OBA Core</span>
              <span className="mt-3 text-[15px] leading-[1.55] text-stone">
                Our own product: see what a change will affect before anyone makes it.
              </span>
            </Link>
          </li>
        </Reveal>
      </Section>

      {/* How we work. */}
      <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="care-title">
        <RevealText as="h2" id="care-title" className="text-title-light max-w-[16ch]">
          What we care about
        </RevealText>
        <Reveal as="div" stagger={0.12} className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2">
          {principles.map((p) => (
            <article key={p.title} className="rounded-[1.25rem] bg-paper/[0.04] p-8 ring-1 ring-paper/10 md:p-10">
              <h3 className="font-display text-[24px] leading-tight text-paper md:text-[28px]">{p.title}</h3>
              <p className="mt-4 text-[17px] leading-[1.6] text-stone">{p.body}</p>
            </article>
          ))}
        </Reveal>
      </Section>

      {/* How to get in touch. */}
      <Section innerClassName="py-24 text-center md:py-36" aria-labelledby="apply-title">
        <RevealText as="h2" id="apply-title" className="text-title-light mx-auto max-w-[20ch]">
          Get in touch
        </RevealText>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-[18px] leading-[1.6] text-ink-soft">
            Send your CV and a line about what you&apos;d like to work on.
          </p>
          <p className="mt-8">
            <a
              href={applyHref}
              className="font-display text-[26px] underline decoration-bronze underline-offset-[8px] hover:decoration-2 md:text-[32px]"
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </Section>
    </>
  );
}
