import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { BrowserFrame } from "@/components/work/BrowserFrame";
import { Showcase } from "@/components/work/Showcase";
import { clients, visibleQuote, type Client } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Who Horquva works with: Vin-Sol in Lahore, Ruqaba in Dubai and Vintage Claims Management in London, and what we've built and look after for each.",
};

export default function WorkPage() {
  return (
    <>
      {/* Opening: the headline, then each client's work rising out of the dark and hanging over into the page. */}
      <Section
        tone="ink"
        className="relative isolate overflow-visible"
        innerClassName="pt-32 text-center md:pt-44"
        aria-labelledby="work-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[70vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.24),transparent_75%)]"
        />
        <RevealText as="h1" id="work-title" className="text-hero mx-auto max-w-[18ch] text-paper">
          Who we work with
        </RevealText>
        <Reveal delay={0.35}>
          <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-[1.6] text-stone md:text-[20px]">
            We&apos;re the technology partner to businesses in Pakistan, the UAE and the UK. Here&apos;s what
            we&apos;ve built for each of them, and what we look after.
          </p>
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.12}
          delay={0.5}
          className="relative z-10 -mx-4 -mb-20 mt-16 flex md:-mb-40 snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 text-left md:mx-0 md:mt-24 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
        >
          {clients.map((c, i) => (
            <li key={c.slug} className={`w-[78%] shrink-0 snap-start md:w-auto ${i === 1 ? "md:translate-y-10" : ""}`}>
              <a href={`#${c.slug}`} className="group block">
                <span className="block font-display text-[20px] leading-tight text-paper md:text-[22px]">{c.name}</span>
                <span className="mt-1 block text-[14px] text-stone">{c.location}</span>
                <BrowserFrame
                  screen={c.showcase.main}
                  sizes="(min-width: 768px) 30vw, 78vw"
                  preload={i === 0}
                  decorative
                  ratio="16/10"
                  className="mt-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-2"
                />
              </a>
            </li>
          ))}
        </Reveal>
      </Section>

      <div className="bg-paper">
        {clients.map((c, i) => (
          <ClientChapter key={c.slug} client={c} first={i === 0} />
        ))}
      </div>

      {/* Close. */}
      <Section tone="ink" innerClassName="py-24 text-center md:py-36" aria-labelledby="next-title">
        <RevealText as="h2" id="next-title" className="text-title-light mx-auto max-w-[20ch] text-paper">
          Have something you need built?
        </RevealText>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-[18px] leading-[1.6] text-stone">
            Tell us what you&apos;re trying to do. We reply within two working days.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" tone="ink">
              Start a project
            </Button>
            <Button href="/#services" variant="glass" tone="ink">
              See our services
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function ClientChapter({ client: c, first }: { client: Client; first: boolean }) {
  const quote = visibleQuote(c);
  return (
    <article
      id={c.slug}
      aria-labelledby={`${c.slug}-name`}
      className={`gutter mx-auto w-full max-w-[1440px] scroll-mt-20 ${first ? "pt-44 md:pt-72" : "border-t border-rule pt-24 md:pt-36"} pb-24 md:pb-36`}
    >
      {/* Who they are. */}
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <RevealText as="h2" id={`${c.slug}-name`} className="text-display">
            {c.name}
          </RevealText>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[34ch] font-display text-[22px] font-light leading-[1.35] tracking-[-0.01em] text-ink-soft md:text-[28px]">
              {c.headline}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.3} as="dl" className="grid grid-cols-2 gap-x-6 gap-y-4 text-[15px] md:col-span-4 md:grid-cols-1 md:justify-self-end md:text-right">
          <div>
            <dt className="text-ink-soft">Based in</dt>
            <dd className="font-medium">{c.location}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Industry</dt>
            <dd className="font-medium">{c.industry}</dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="sr-only">Our role</dt>
            <dd className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[14px] text-paper">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-bronze" />
              Technology partner, ongoing
            </dd>
          </div>
        </Reveal>
      </div>

      {/* The work itself. */}
      <Reveal className="mt-12 md:mt-16">
        <figure>
          <Showcase client={c} />
          <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[14px] text-ink-soft">
            <span>{c.showcase.caption}</span>
            <TextLink href={c.url} external className="text-[16px] text-ink">
              Visit {c.domain}
            </TextLink>
          </figcaption>
        </figure>
      </Reveal>

      {/* What we did, and what's in it. */}
      <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <h3 className="text-[15px] text-ink-soft">About them</h3>
          <p className="mt-2 text-[18px] leading-[1.6]">{c.about}</p>
          <h3 className="mt-10 text-[15px] text-ink-soft">What we did</h3>
          <p className="mt-2 text-[18px] leading-[1.6]">{c.did}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Services for ${c.name}`}>
            {c.services.map((s) => (
              <li key={s} className="rounded-full px-3.5 py-1.5 text-[14px] ring-1 ring-inset ring-ink/20">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="space-y-12 md:col-span-6 md:col-start-7">
          {c.details.map((d) => (
            <Reveal key={d.title}>
              <h3 className="font-display text-[24px] leading-tight md:text-[28px]">{d.title}</h3>
              <ul className="mt-5 border-t border-rule">
                {d.items.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-rule py-4 text-[16px] leading-[1.5] md:text-[17px]">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                    {item}
                  </li>
                ))}
              </ul>
              {d.stack && <p className="mt-4 text-[14px] text-ink-soft">Built with {d.stack.join(" and ")}</p>}
            </Reveal>
          ))}
        </div>
      </div>

      {/* In their words. */}
      {quote && (
        <Reveal as="figure" className="mx-auto mt-20 max-w-4xl md:mt-32">
          <span aria-hidden className="block font-display text-[88px] leading-[0.6] text-bronze md:text-[120px]">
            &ldquo;
          </span>
          <blockquote className="mt-2 font-display text-[28px] font-light leading-[1.25] tracking-[-0.02em] md:text-[42px]">
            {quote.text}
          </blockquote>
          <figcaption className="mt-8 text-[16px]">
            <span className="font-medium">{quote.name}</span>
            <span className="text-ink-soft">
              , {quote.role}, {c.name}
            </span>
          </figcaption>
        </Reveal>
      )}
    </article>
  );
}
