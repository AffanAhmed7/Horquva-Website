import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { clients, visibleQuote } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Who Horquva works with: Vin-Sol in Lahore, Ruqaba in Dubai and Vintage Claims Management in London, and what we've built and look after for each.",
};

const onward = [
  { href: "/contact", title: "Start a project", body: "Tell us what you're trying to do. We reply within two working days." },
  { href: "/#services", title: "See our services", body: "What we build, and how we go about it." },
];

export default function WorkPage() {
  return (
    <>
      {/* Opening. */}
      <Section
        tone="ink"
        className="relative isolate overflow-hidden"
        innerClassName="pt-32 pb-24 text-center md:pt-44 md:pb-32"
        aria-labelledby="work-title"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(169,130,90,0.22),transparent_75%)]"
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
      </Section>

      {/* One plain row per client. */}
      <Section innerClassName="pb-16 md:pb-24" aria-label="Clients">
        {clients.map((c, i) => {
          const quote = visibleQuote(c);
          return (
            <article
              key={c.slug}
              aria-labelledby={c.slug}
              className={`grid gap-10 py-20 md:grid-cols-12 md:py-28 ${i > 0 ? "border-t border-rule" : ""}`}
            >
              <figure className="md:col-span-7">
                <RevealImage className="overflow-hidden rounded-[1.25rem]">
                  <Photo
                    src={c.image?.src}
                    alt={c.image?.alt ?? c.name}
                    ratio="16/10"
                    priority={i === 0}
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="rounded-[1.25rem] ring-1 ring-rule"
                  />
                </RevealImage>
                {c.image && <figcaption className="mt-3 text-[14px] text-ink-soft">{c.image.caption}</figcaption>}
              </figure>

              <Reveal className="md:col-span-5">
                <p className="text-[14px] text-bronze-deep">
                  {c.number} · {c.location} · {c.industry}
                </p>
                <h2 id={c.slug} className="mt-3 font-display text-[34px] leading-tight md:text-[40px]">
                  {c.name}
                </h2>
                <p className="mt-2 text-[15px] text-ink-soft">Technology partner · Ongoing</p>

                <h3 className="mt-8 font-medium">About them</h3>
                <p className="mt-2 leading-[1.6] text-ink-soft">{c.about}</p>

                <h3 className="mt-6 font-medium">What we did</h3>
                <p className="mt-2 leading-[1.6] text-ink-soft">{c.did}</p>

                <ul className="mt-6 space-y-2" aria-label={`Services for ${c.name}`}>
                  {c.services.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-[16px]">
                      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-bronze" />
                      {s}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-[16px]">
                  <TextLink href={c.url} external>
                    Visit {c.domain}
                  </TextLink>
                </p>

                {quote && (
                  <figure className="mt-10">
                    <blockquote className="border-l-2 border-bronze pl-4 text-[17px] leading-[1.55]">
                      {quote.text}
                    </blockquote>
                    <figcaption className="mt-3 pl-4 text-[14px] text-ink-soft">
                      {quote.name}, {quote.role}, {c.name}
                    </figcaption>
                  </figure>
                )}
              </Reveal>
            </article>
          );
        })}
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
