import { RevealText } from "@/components/motion/RevealText";
import { RevealImage } from "@/components/motion/RevealImage";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { processSteps, workingTerms } from "@/content/process";
import manifest from "@/content/photo-manifest.json";

export function ProcessSteps() {
  return (
    <Section tone="ink" innerClassName="py-24 md:py-36" aria-labelledby="process-title">
      <div className="grid gap-10 md:grid-cols-12">
        <RevealText as="h2" id="process-title" className="text-title-light md:col-span-6">
          How we work
        </RevealText>
        <p className="text-[19px] leading-[1.5] text-stone md:col-span-5 md:col-start-8 md:self-end">
          Every project runs the same way, whether it&apos;s a WhatsApp agent or a WordPress rebuild. You always know
          what&apos;s being built, what it costs and what happens next.
        </p>
      </div>

      <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
        {processSteps.map((step) => (
          <li key={step.title} className="border-t border-rule-dark pt-6">
            <h3 className="font-display text-[26px] leading-tight">{step.title}</h3>
            <p className="mt-4 leading-[1.6] text-stone">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12 md:items-center md:gap-10">
        <RevealImage parallax className="overflow-hidden md:col-span-8">
          <Photo src="/photos/process.jpg" alt={manifest.photos.process.alt} ratio="4/3" sizes="(min-width: 768px) 66vw, 100vw" />
        </RevealImage>
        <div className="md:col-span-4">
          <p className="text-[14px] font-bold uppercase tracking-[0.08em] text-white">What you can count on</p>
          <ul className="mt-6">
            {workingTerms.map((term) => (
              <li key={term} className="border-t border-rule-dark py-5 text-[18px] leading-snug">
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
