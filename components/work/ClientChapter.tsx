import Link from "next/link";
import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { TextLink } from "@/components/ui/TextLink";
import type { Client } from "@/content/work";
import { ScreenGallery, Showcase } from "./Showcase";

/**
 * One client: a short paragraph on who they are and what we did beside the main screens, then each part of
 * the work in a few sentences beside its own screens. A compact client keeps its details in the first row.
 */
export function ClientChapter({ client: c, first }: { client: Client; first: boolean }) {
  const compact = c.compact === true;
  const city = c.location.split(",")[0];

  return (
    <article
      id={c.slug}
      aria-labelledby={`${c.slug}-name`}
      className={`gutter mx-auto w-full max-w-[1440px] scroll-mt-20 ${compact ? "py-20 md:py-24" : "py-24 md:py-32"} ${first ? "" : "border-t border-rule"}`}
    >
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-10">
        <div className="md:col-span-5">
          <RevealText as="h2" id={`${c.slug}-name`} className="font-display text-[clamp(1.875rem,2.6vw,2.5rem)] font-light leading-[1.04] tracking-[-0.025em]">
            {c.name}
          </RevealText>
          <Reveal delay={0.15}>
            <p className="mt-3 text-[15px] text-ink-soft">
              {c.kind}, {city}
            </p>

            <p className="mt-8 max-w-[52ch] text-[18px] leading-[1.65] text-ink-soft">{c.did}</p>
            {compact &&
              c.details.map((d) => (
                <p key={d.title} className="mt-4 max-w-[52ch] text-[18px] leading-[1.65] text-ink-soft">
                  {d.body}
                </p>
              ))}

            <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.7] text-ink-soft">
              {c.services.map((s, i) => (
                <Fragment key={s.name}>
                  {i > 0 && ", "}
                  <Link
                    href={`/services/${s.service}`}
                    className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-bronze"
                  >
                    {s.name}
                  </Link>
                </Fragment>
              ))}
            </p>

            <p className="mt-6 text-[16px]">
              <TextLink href={c.url} external>
                Visit {c.domain}
              </TextLink>
            </p>
          </Reveal>
        </div>

        <Reveal className="md:col-span-7">
          <figure>
            <Showcase client={c} preload={first} />
          </figure>
        </Reveal>
      </div>

      {!compact &&
        c.details.map((d) => (
          // A few sentences on the left; the screens of that part on the right.
          <div key={d.title} className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:items-center md:gap-10">
            <Reveal className="md:col-span-5">
              <h3 className="font-display text-[26px] font-light leading-tight tracking-[-0.02em] md:text-[30px]">{d.title}</h3>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.65] text-ink-soft">{d.body}</p>
              {d.items && (
                <ul className="mt-5 list-disc space-y-1.5 pl-5 text-[16px] leading-[1.55] text-ink-soft marker:text-bronze">
                  {d.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {d.link && (
                <p className="mt-6 text-[16px]">
                  <TextLink href={d.link.url} external>
                    Visit {d.link.domain}
                  </TextLink>
                </p>
              )}
            </Reveal>
            <Reveal className="md:col-span-7">
              {d.screens && <ScreenGallery screens={d.screens} label={`Screens: ${d.title}`} />}
            </Reveal>
          </div>
        ))}
    </article>
  );
}
