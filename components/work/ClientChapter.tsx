import Link from "next/link";
import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { TextLink } from "@/components/ui/TextLink";
import type { Client } from "@/content/work";
import { ScreenGallery, Showcase } from "./Showcase";

/**
 * One client: who they are and what we did beside the main screens, then each part of the work
 * beside its own screens. A compact client keeps its details in the first row instead.
 */
export function ClientChapter({ client: c, first }: { client: Client; first: boolean }) {
  const compact = c.compact === true;
  const facts = [
    { label: "Based in", value: c.location },
    { label: "Industry", value: c.industry },
    { label: "Our role", value: "Technology partner, ongoing" },
    {
      label: "Services",
      value: c.services.map((s, i) => (
        <Fragment key={s.name}>
          {i > 0 && ", "}
          <Link
            href={`/services/${s.service}`}
            className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-bronze"
          >
            {s.name}
          </Link>
        </Fragment>
      )),
    },
  ];

  return (
    <article
      id={c.slug}
      aria-labelledby={`${c.slug}-name`}
      className={`gutter mx-auto w-full max-w-[1440px] scroll-mt-20 ${compact ? "py-20 md:py-24" : "py-24 md:py-32"} ${first ? "" : "border-t border-rule"}`}
    >
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-10">
        <div className="md:col-span-5">
          <RevealText as="h2" id={`${c.slug}-name`} className="text-title-light">
            {c.name}
          </RevealText>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40ch] text-[19px] leading-[1.5] text-ink-soft md:text-[20px]">{c.headline}</p>

            <dl className="mt-10 border-t border-rule text-[15px]">
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-rule py-3">
                  <dt className="text-ink-soft">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <h3 className="text-[15px] font-medium">What we did</h3>
              <p className="mt-2 text-[17px] leading-[1.6] text-ink-soft">{c.did}</p>
            </div>

            {compact &&
              c.details.map((d) => (
                <div key={d.title} className="mt-7">
                  <h3 className="text-[15px] font-medium">{d.title}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {d.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[16px] leading-[1.5] text-ink-soft">
                        <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

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
          </figure>
        </Reveal>
      </div>

      {!compact &&
        c.details.map((d) => {
          const title = (
            <h3 className="font-display text-[26px] font-light leading-tight tracking-[-0.02em] md:text-[30px]">{d.title}</h3>
          );
          const list = (
            <>
              <ul className="border-t border-rule">
                {d.items.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-rule py-3.5 text-[16px] leading-[1.5]">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                    {item}
                  </li>
                ))}
              </ul>
              {d.stack && <p className="mt-3 text-[14px] text-ink-soft">Built with {d.stack.join(" and ")}</p>}
            </>
          );

          // Title and list on the left; screens on the right, with any smaller related part under them.
          return (
            <div key={d.title} className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:items-center md:gap-10">
              <Reveal className="md:col-span-5">
                {title}
                <div className="mt-5">{list}</div>
              </Reveal>
              <Reveal className="md:col-span-7">
                {d.screens && <ScreenGallery screens={d.screens} label={`Screens: ${d.title}`} />}
                {d.note && (
                  <div className={d.screens ? "mt-10" : ""}>
                    <h4 className="font-display text-[22px] font-light leading-tight tracking-[-0.01em] md:text-[24px]">
                      {d.note.title}
                    </h4>
                    <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {d.note.items.map((item) => (
                        <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-ink-soft">
                          <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            </div>
          );
        })}
    </article>
  );
}
