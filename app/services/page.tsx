import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI and automation, computer vision, web and software development, real-time systems, e-commerce, integrations and consulting.",
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="What we build"
        lead={
          <p>
            AI-powered software products, business automation, SaaS platforms, real-time applications and custom
            software, from first idea through production. Most projects draw on two or three of these.
          </p>
        }
      />
      <Section innerClassName="pb-28 md:pb-40">
        <ol className="border-t border-rule">
          {services.map((s) => (
            <li key={s.slug} className="grid gap-8 border-b border-rule py-12 md:grid-cols-12 md:gap-10 md:py-16">
              <Link href={`/services/${s.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-ink md:col-span-4">
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  unoptimized={s.photo.src.startsWith("http")}
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
              </Link>
              <div className="md:col-span-8">
                <p className="text-[14px] text-bronze-deep tabular-nums">{s.number}</p>
                <h2 className="mt-2 text-heading">
                  <Link href={`/services/${s.slug}`} className="hover:text-bronze-deep">
                    {s.name}
                  </Link>
                </h2>
                <p className="mt-4 max-w-2xl text-[18px] leading-[1.5] text-ink-soft">{s.summary}</p>
                <ul className="mt-8 grid gap-x-10 gap-y-2.5 text-[16px] sm:grid-cols-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="mt-[0.65em] h-px w-3 shrink-0 bg-bronze" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-[16px]">
                  <Link
                    href={`/services/${s.slug}`}
                    className="underline decoration-bronze underline-offset-[6px] hover:decoration-2"
                  >
                    More about {s.name.toLowerCase()}
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
