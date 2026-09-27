import Image from "next/image";
import { RevealText } from "@/components/motion/RevealText";
import { TextLink } from "@/components/ui/TextLink";
import manifest from "@/content/photo-manifest.json";

/** Full-bleed night photograph with the headline set over its lower half. */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-ink text-paper md:min-h-[calc(100svh-5rem)]">
      <Image
        src="/photos/hero.jpg"
        alt={manifest.photos.hero.alt}
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Darkens the lower part of the photo so the text stays readable. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgb(21 18 15 / 0.92) 0%, rgb(21 18 15 / 0.6) 45%, rgb(21 18 15 / 0.15) 100%)",
        }}
      />

      <div className="gutter mx-auto w-full max-w-[1440px] pb-14 pt-32 md:pb-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <RevealText
            as="h1"
            className="text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[1] tracking-[-0.03em] md:col-span-8"
          >
            We build the software and AI systems businesses depend on.
          </RevealText>
          <div className="md:col-span-4">
            <p className="text-[17px] leading-[1.55] text-paper/85">
              Horquva is an engineering company in Karachi. We take on AI, automation, web and data work for
              clients, and we&apos;re building OBA Core, a product that shows organisations what a change will
              affect before they make it.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[16px]">
              <TextLink href="/contact">Start a project</TextLink>
              <TextLink href="/services">See what we build</TextLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
