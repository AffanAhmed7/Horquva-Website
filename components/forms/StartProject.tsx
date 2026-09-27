import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { site } from "@/content/site";

const next = [
  { title: "We read it properly", body: "A person on the team reads every enquiry and replies within two working days." },
  { title: "A short call", body: "We talk through the problem, where it runs today and what a good result looks like." },
  { title: "A written scope", body: "You get a fixed scope and price before anything is built." },
];

type Props = {
  /** h1 on the contact page, h2 where it closes the home page. */
  as?: "h1" | "h2";
  titleId: string;
  /** The form to show on the card (in its ink tone). */
  children: ReactNode;
};

/**
 * "Start a project" on ink: the headline, what happens after you write, and other ways to reach us on
 * the left; the form on a faint glass panel on the right. Used on the contact page and at the end of home.
 */
export function StartProject({ as = "h2", titleId, children }: Props) {
  return (
    <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <RevealText as={as} id={titleId} className="text-hero text-paper">
          Start a project
        </RevealText>
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-md text-[18px] leading-[1.6] text-stone">
            Tell us what you&apos;re trying to do. It doesn&apos;t need to be a finished brief: a few lines about the
            problem is enough to start.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-14">
          <p className="text-[13px] uppercase tracking-[0.12em] text-stone">What happens next</p>
          <ol className="mt-5 border-t border-rule-dark">
            {next.map((n) => (
              <li key={n.title} className="border-b border-rule-dark py-5">
                <p className="font-display text-[19px] leading-tight text-paper">{n.title}</p>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-stone">{n.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.6} className="mt-12 space-y-2 text-[16px]">
          <p className="text-stone">Prefer email?</p>
          <p>
            <a
              href={`mailto:${site.email}`}
              className="font-display text-[22px] text-paper underline decoration-bronze underline-offset-[6px] hover:decoration-2"
            >
              {site.email}
            </a>
          </p>
          <p className="pt-4 text-stone">
            Based in {site.city}, {site.country} ·{" "}
            <a href={site.linkedin} className="text-paper underline decoration-bronze underline-offset-4">
              LinkedIn
            </a>
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="lg:col-span-7">
        <div className="rounded-[1.5rem] bg-paper/[0.03] p-7 text-paper ring-1 ring-paper/10 backdrop-blur-sm sm:p-10 md:p-12">
          <p className="font-display text-[24px] leading-tight md:text-[28px]">Tell us about it</p>
          <p className="mt-2 text-[15px] text-stone">All fields except company are required.</p>
          <div className="mt-10">{children}</div>
        </div>
      </Reveal>
    </div>
  );
}
