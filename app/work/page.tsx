import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { ScreenGallery, Showcase } from "@/components/work/Showcase";
import { clients, visibleQuote, type Client } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Who Horquva works with: Vin-Sol in Lahore, Ruqaba in Dubai and Vintage Claims Management in London, and what we've built and look after for each.",
};

export default function WorkPage() {
  const quotes = clients.flatMap((c) => {
    const quote = visibleQuote(c);
    return quote ? [{ client: c, quote }] : [];
  });

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

      <div className="bg-paper">
        {clients.map((c, i) => (
          <ClientChapter key={c.slug} client={c} first={i === 0} />
        ))}
      </div>

      {/* In their words. */}
      {quotes.length > 0 && (
        <Section innerClassName="pb-24 md:pb-36" aria-labelledby="quotes-title">
          <div className="border-t border-rule pt-24 md:pt-32">
            <RevealText as="h2" id="quotes-title" className="text-title-light max-w-[16ch]">
              In their words
            </RevealText>
            <Reveal as="ul" stagger={0.12} className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2">
              {quotes.map(({ client: c, quote }) => (
                <li key={c.slug}>
                  <figure className="flex h-full flex-col rounded-[1.25rem] bg-[#FBF9F5] p-8 ring-1 ring-rule md:p-10">
                    <span aria-hidden className="block font-display text-[72px] leading-[0.6] text-bronze">
                      &ldquo;
                    </span>
                    <blockquote className="mt-4 font-display text-[22px] font-light leading-[1.35] tracking-[-0.01em] md:text-[26px]">
                      {quote.text}
                    </blockquote>
                    <figcaption className="mt-auto pt-10 text-[15px]">
                      <span className="block font-medium">{quote.name}</span>
                      <span className="block text-ink-soft">
                        {quote.role}, {c.name}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </Reveal>
          </div>
        </Section>
      )}

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

/**
 * One client in two rows: who they are and what we did beside the main screens, then the details
 * of the work beside more of its screens.
 */
function ClientChapter({ client: c, first }: { client: Client; first: boolean }) {
  return (
    <article
      id={c.slug}
      aria-labelledby={`${c.slug}-name`}
      className={`gutter mx-auto w-full max-w-[1440px] scroll-mt-20 py-24 md:py-32 ${first ? "" : "border-t border-rule"}`}
    >
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-10">
        <div className="md:col-span-5">
          <RevealText as="h2" id={`${c.slug}-name`} className="text-heading">
            {c.name}
          </RevealText>
          <Reveal delay={0.15}>
            <p className="mt-5 font-display text-[21px] font-light leading-[1.4] tracking-[-0.01em] text-ink-soft md:text-[24px]">
              {c.headline}
            </p>

            <dl className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4 text-[15px]">
              <div>
                <dt className="text-ink-soft">Based in</dt>
                <dd className="font-medium">{c.location}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Industry</dt>
                <dd className="font-medium">{c.industry}</dd>
              </div>
              <div>
                <dt className="sr-only">Our role</dt>
                <dd className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[14px] text-paper">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-bronze" />
                  Technology partner, ongoing
                </dd>
              </div>
            </dl>

            <h3 className="mt-10 text-[15px] text-ink-soft">About them</h3>
            <p className="mt-2 text-[17px] leading-[1.6]">{c.about}</p>
            <h3 className="mt-8 text-[15px] text-ink-soft">What we did</h3>
            <p className="mt-2 text-[17px] leading-[1.6]">{c.did}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Services for ${c.name}`}>
              {c.services.map((s) => (
                <li key={s} className="rounded-full bg-ink/[0.06] px-3.5 py-1.5 text-[14px]">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[16px]">
              <TextLink href={c.url} external>
                Visit {c.domain}
              </TextLink>
            </p>
          </Reveal>
        </div>

        <Reveal className="md:col-span-7">
          <figure>
            <Showcase client={c} preload={first} />
            <figcaption className="mt-4 text-[14px] text-ink-soft">{c.showcase.caption}</figcaption>
          </figure>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
        <div className="space-y-12 md:col-span-5">
          {c.details.map((d) => (
            <Reveal key={d.title}>
              <h3 className="font-display text-[22px] leading-tight md:text-[24px]">{d.title}</h3>
              <ul className="mt-4 border-t border-rule">
                {d.items.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-rule py-3.5 text-[16px] leading-[1.5]">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                    {item}
                  </li>
                ))}
              </ul>
              {d.stack && <p className="mt-3 text-[14px] text-ink-soft">Built with {d.stack.join(" and ")}</p>}
            </Reveal>
          ))}
        </div>
        <Reveal className="md:col-span-7">
          <ScreenGallery client={c} />
        </Reveal>
      </div>
    </article>
  );
}
