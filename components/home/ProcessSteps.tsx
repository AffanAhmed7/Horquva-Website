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
        <RevealText as="h2" id="process-title" className="text-title md:col-span-6">
          How we work
        </RevealText>
        <p className="text-[19px] leading-[1.5] text-stone md:col-span-5 md:col-start-8 md:self-end">
          Every project runs the same way, whether it&apos;s a WhatsApp agent or a WordPress rebuild. You always know
          what&apos;s being built, what it costs and what happens next.
        </p>
      </div>

      <ol className="mt-16 grid gap-x-8 gap-y-12 border-t border-rule-dark pt-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {processSteps.map((step) => (
          <li key={step.title}>
            <p className="text-[15px] text-bronze tabular-nums">{step.number}</p>
            <h3 className="mt-3 text-[28px] leading-tight">{step.title}</h3>
            <p className="mt-4 text-stone">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:items-end">
        <RevealImage className="md:col-span-8">
          <Photo src="/photos/process.jpg" alt={manifest.photos.process.alt} ratio="3/2" sizes="(min-width: 768px) 66vw, 100vw" />
        </RevealImage>
        <ul className="space-y-4 text-[17px] md:col-span-4">
          {workingTerms.map((term) => (
            <li key={term} className="border-t border-rule-dark pt-4">
              {term}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
