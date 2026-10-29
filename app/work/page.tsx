import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ClientChapter } from "@/components/work/ClientChapter";
import { clients, visibleQuote } from "@/content/work";

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
        innerClassName="flex min-h-[80svh] flex-col items-center justify-center pt-36 pb-28 text-center md:min-h-[92svh] md:pt-48 md:pb-40"
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
