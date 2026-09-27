import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealList } from "@/components/motion/RevealList";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { getService, services } from "@/content/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: service.name, description: service.summary };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const enquiryHref = `/contact?service=${encodeURIComponent(service.name)}`;

  return (
    <>
      <Section innerClassName="pt-32 pb-12 text-center md:pt-40 md:pb-16">
        <RevealText as="h1" className="text-hero mx-auto max-w-[18ch]">
          {service.name}
        </RevealText>
        <p className="mx-auto mt-8 max-w-[58ch] text-[19px] leading-[1.55] text-ink-soft md:mt-10 md:text-[21px]">
          {service.intro}
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button href={enquiryHref}>Discuss a project</Button>
          <p className="text-[14px] text-ink-soft">We reply within two working days.</p>
        </div>
      </Section>

      <div className="gutter mx-auto w-full max-w-[1440px]">
        <RevealImage className="overflow-hidden rounded-[1.25rem]">
          <Photo src={service.photo.src} alt={service.photo.alt} ratio="21/9" priority className="max-md:aspect-[4/3]!" />
        </RevealImage>
      </div>

      <Section innerClassName="py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* Stays in view while the list beside it scrolls past. */}
          <p className="font-display text-[22px] font-light leading-[1.45] tracking-[-0.01em] md:sticky md:top-32 md:col-span-5 md:self-start md:text-[26px]">
            {service.overview}
          </p>
          <RevealList className="border-t border-rule md:col-span-6 md:col-start-7" aria-label="What we offer">
            {service.items.map((d) => (
              <li key={d} className="group relative isolate flex items-center gap-5 overflow-hidden border-b border-rule py-5 pl-3">
                {/* Warm wash that sweeps in from the left on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-bronze/20 via-bronze/8 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                />
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full bg-bronze transition-[width] duration-500 ease-out-expo group-hover:w-6"
                />
                <span className="font-display text-[18px] leading-snug transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:text-[21px]">
                  {d}
                </span>
              </li>
            ))}
          </RevealList>
        </div>
      </Section>

      <Section tone="ink" innerClassName="py-24 md:py-32" aria-labelledby="projects-title">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="projects-title" className="text-heading">
              Typical projects
            </h2>
            <p className="mt-4 max-w-xs text-stone">Examples of the kind of work we take on.</p>
          </div>
          <div className="grid gap-12 md:col-span-8 md:grid-cols-2">
            {service.scenarios.map((s) => (
              <article key={s.title} className="border-t border-rule-dark pt-6">
                <h3 className="text-[24px] leading-tight">{s.title}</h3>
                <p className="mt-4 text-stone">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
