import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RevealImage } from "@/components/motion/RevealImage";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { getService, nextService, services } from "@/content/services";

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
  const next = nextService(slug);
  const enquiryHref = `/contact?service=${encodeURIComponent(service.name)}`;

  return (
    <>
      <Section innerClassName="pt-14 pb-14 md:pt-24 md:pb-20">
        <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 md:grid-cols-[4rem_1fr]">
          <span className="pt-[0.6em] text-[15px] text-bronze-deep tabular-nums">{service.number}</span>
          <RevealText as="h1" className="text-display max-w-[16ch]">
            {service.name}
          </RevealText>
        </div>
        <div className="mt-12 grid md:mt-16 md:grid-cols-12">
          <p className="text-[19px] leading-[1.5] text-ink-soft md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
            {service.intro}
          </p>
        </div>
      </Section>

      <RevealImage>
        <Photo src={service.photo.src} alt={service.photo.alt} ratio="16/7" priority className="max-md:aspect-[4/3]!" />
      </RevealImage>

      <Section innerClassName="py-24 md:py-32" aria-labelledby="build-title">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="build-title" className="text-heading md:col-span-4">
            What we build
          </h2>
          <ul className="md:col-span-8">
            {service.deliverables.map((d) => (
              <li key={d} className="border-t border-rule py-5 text-[19px] leading-snug last:border-b">
                {d}
              </li>
            ))}
          </ul>
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

      <Section innerClassName="py-24 md:py-32" aria-labelledby="work-title">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="work-title" className="text-heading md:col-span-4">
            How we&apos;d work on it
          </h2>
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:col-span-8">
            {service.process.map((p, i) => (
              <li key={p.step} className="border-t border-rule pt-5">
                <p className="text-[15px] text-bronze-deep tabular-nums">0{i + 1}</p>
                <h3 className="mt-2 text-[22px]">{p.step}</h3>
                <p className="mt-3 text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-24 grid gap-10 md:grid-cols-12">
          <h2 className="text-heading md:col-span-4">Stack</h2>
          <p className="text-[19px] leading-relaxed text-ink-soft md:col-span-8">{service.stack.join(", ")}</p>
        </div>

        <div className="mt-24 flex flex-wrap items-center gap-6 border-t border-rule pt-12 md:mt-32">
          <Button href={enquiryHref}>Discuss a project like this</Button>
          <p className="text-ink-soft">We reply within two working days.</p>
        </div>
      </Section>

      <Section tone="ink">
        <Link href={`/services/${next.slug}`} className="group block py-20 md:py-28">
          <span className="text-title flex items-baseline justify-between gap-6 transition-colors group-hover:text-bronze">
            <span>
              <span className="sr-only">Next service: </span>
              {next.name}
            </span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-3">
              →
            </span>
          </span>
        </Link>
      </Section>
    </>
  );
}
