import type { ReactNode } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "./Section";

type Props = { title: string; lead?: ReactNode; titleClassName?: string };

/** Opening block for inner pages: a large left-aligned title with the lead set off to the right. */
export function PageIntro({ title, lead, titleClassName = "max-w-[16ch]" }: Props) {
  return (
    <Section innerClassName="pb-16 pt-16 md:pb-24 md:pt-28">
      <RevealText as="h1" className={`text-display ${titleClassName}`}>
        {title}
      </RevealText>
      {lead && (
        <div className="mt-10 grid md:mt-14 md:grid-cols-12">
          <div className="text-[19px] leading-[1.5] text-ink-soft md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
            {lead}
          </div>
        </div>
      )}
    </Section>
  );
}
