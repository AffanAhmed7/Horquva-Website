import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { TextLink } from "@/components/ui/TextLink";
import type { Client } from "@/content/work";
import { ScreenGallery, Showcase } from "./Showcase";

/**
 * One client in two rows: who they are and what we did beside the main screens, then the details
 * of the work beside more of its screens.
 */
export function ClientChapter({ client: c, first }: { client: Client; first: boolean }) {
  const facts = [
    { label: "Based in", value: c.location },
    { label: "Industry", value: c.industry },
    { label: "Our role", value: "Technology partner, ongoing" },
    { label: "Services", value: c.services.join(", ") },
  ];

  return (
    <article
      id={c.slug}
      aria-labelledby={`${c.slug}-name`}
      className={`gutter mx-auto w-full max-w-[1440px] scroll-mt-20 py-24 md:py-32 ${first ? "" : "border-t border-rule"}`}
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

            <div className="mt-10 space-y-7">
              <div>
                <h3 className="text-[15px] font-medium">About them</h3>
                <p className="mt-2 text-[17px] leading-[1.6] text-ink-soft">{c.about}</p>
              </div>
              <div>
                <h3 className="text-[15px] font-medium">What we did</h3>
                <p className="mt-2 text-[17px] leading-[1.6] text-ink-soft">{c.did}</p>
              </div>
            </div>

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
              <h3 className="font-display text-[26px] font-light leading-tight tracking-[-0.02em] md:text-[30px]">
                {d.title}
              </h3>
              <ul className="mt-5 border-t border-rule">
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
