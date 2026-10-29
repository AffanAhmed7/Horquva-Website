"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Showcase } from "@/components/work/Showcase";
import { clients, visibleQuote } from "@/content/work";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** How long each client stays up before the next slides in, unless a name is clicked. */
const SLIDE_MS = 3000;

/**
 * A preview of the Work page: small tabs over one large product shot that slides to the chosen client,
 * with a caption under it. Left alone, it moves on to the next client by itself.
 */
export function WorkStrip() {
  const [active, setActive] = useState(0);
  // Bumped on every click, so choosing a client (even the current one) gives it a full turn again.
  const [turn, setTurn] = useState(0);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const quoted = clients.find((c) => visibleQuote(c));
  const quote = quoted && visibleQuote(quoted);

  // Only move on while the section is on screen, so nobody misses the first client.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = !reduced;
  const paused = !inView;
  const next = () => setActive((i) => (i + 1) % clients.length);

  return (
    <Section innerClassName="pb-24 md:pb-36" aria-labelledby="work-strip-title">
      <div className="border-t border-rule pt-32 md:pt-44">
        <div className="text-center">
          <RevealText as="h2" id="work-strip-title" className="mx-auto font-display text-[clamp(1.875rem,3.2vw,3rem)] font-light leading-[1.04] tracking-[-0.025em]">
            Who we work with
          </RevealText>
          <Reveal delay={0.35}>
            <p className="mx-auto mt-5 max-w-[46ch] text-[18px] leading-[1.55] text-ink-soft">
              We&apos;re the technology partner to agencies and businesses in Lahore, Dubai and London.{" "}
              <TextLink href="/work" className="text-ink">
                See our work
              </TextLink>
            </p>
          </Reveal>
        </div>

        <div ref={root} className="mt-12 md:mt-16">
          {/* Plain-text tabs; a bronze line under the chosen one fills while its screens are up. */}
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] md:gap-x-12 md:text-[16px]">
            {clients.map((c, i) => {
              const on = i === active;
              return (
                <li key={c.slug} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(i);
                      setTurn((t) => t + 1);
                    }}
                    aria-pressed={on}
                    aria-controls="work-strip-screens"
                    className={`pb-2 transition-colors duration-300 ${on ? "text-ink" : "text-ink-soft hover:text-ink"}`}
                  >
                    {c.name}
                  </button>
                  {on && (
                    <span
                      key={`${active}-${turn}`}
                      aria-hidden
                      onAnimationEnd={autoplay ? next : undefined}
                      className="absolute inset-x-0 bottom-0 h-px origin-left bg-bronze"
                      style={
                        autoplay
                          ? {
                              animation: `work-progress ${SLIDE_MS}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }
                          : undefined
                      }
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* A sliding window: the screens sit side by side on a track that moves to the chosen client. Its width
              is capped by the window height too, so a slide and its caption always fit on one screen. */}
          <div id="work-strip-screens" className="-mx-4 mt-8 overflow-hidden px-4 pb-8 pt-4 md:-mx-8 md:mt-10 md:px-8">
            <div
              className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{ transform: `translateX(calc(${-active} * (100% + 4rem)))` }}
            >
              {clients.map((c, i) => (
                <div
                  key={c.slug}
                  inert={i !== active}
                  className={`mr-16 w-full shrink-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-40"}`}
                >
                  <div className="mx-auto max-w-[min(960px,calc((100svh-14rem)*1.75))]">
                    <Showcase client={c} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* One caption line under the image, swapped with the slide. */}
          <div className="mx-auto grid max-w-[min(960px,calc((100svh-14rem)*1.75))] border-t border-rule pt-5">
            {clients.map((c, i) => (
              <div
                key={c.slug}
                inert={i !== active}
                className={`grid gap-2 text-[15px] transition-opacity duration-500 [grid-area:1/1] md:grid-cols-12 md:gap-6 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <p className="font-medium md:col-span-3">
                  {c.name}, <span className="font-normal text-ink-soft">{c.location.split(",")[0]}</span>
                </p>
                <p className="leading-[1.5] text-ink-soft md:col-span-6">{c.headline}</p>
                <p className="md:col-span-3 md:text-right">
                  <TextLink href={`/work#${c.slug}`} className="text-ink">
                    See the work
                  </TextLink>
                </p>
              </div>
            ))}
          </div>
        </div>
        {quoted && quote && (
          <Reveal>
            <figure className="mx-auto mt-20 max-w-3xl text-center md:mt-28">
              <span aria-hidden className="block font-display text-[64px] leading-[0.6] text-bronze">
                &ldquo;
              </span>
              <blockquote className="mt-4 font-display text-[24px] font-light leading-[1.35] tracking-[-0.01em] md:text-[30px]">
                {quote.text}
              </blockquote>
              <figcaption className="mt-6 text-[15px]">
                <span className="font-medium">{quote.name}</span>
                <span className="text-ink-soft">
                  , {quote.role}, {quoted.name}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
