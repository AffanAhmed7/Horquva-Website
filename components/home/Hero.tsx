import Image from "next/image";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { RevealText } from "@/components/motion/RevealText";
import { TextLink } from "@/components/ui/TextLink";
import manifest from "@/content/photo-manifest.json";

/** Full-bleed night photograph with the headline set over its lower half. The header floats over it. */
export function Hero() {
  return (
    <section
      data-hero=""
      data-tone="ink"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink text-paper"
    >
      <HeroMotion
        media={
          <Image
            src="/photos/hero.jpg"
            alt={manifest.photos.hero.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        }
      >
        <div className="gutter relative mx-auto w-full max-w-[1440px] py-32 md:flex md:min-h-svh md:items-center">
          <RevealText as="h1" className="text-hero max-w-2xl">
            Every business
            <br />
            runs on a hidden
            <br />
            structure no one
            <br />
            has mapped
          </RevealText>

          {/* Supporting copy and actions sit in the bottom-right corner on wider screens. */}
          <div className="mt-10 md:absolute md:bottom-20 md:right-[clamp(1rem,4vw,3.5rem)] md:mt-0 md:w-[26rem]">
            <p className="text-[17px] leading-[1.55] text-paper/85">
              Most organisations can name their systems. Almost none can show what they actually depend on.
              Horquva captures what people know and proves what systems show: one living model of how your
              business actually runs. So when something changes, you already know what breaks.
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 text-[16px]">
              <TextLink href="/oba-core">See what Horquva finds</TextLink>
              <TextLink href="/approach">How we work</TextLink>
            </p>
          </div>
        </div>
      </HeroMotion>

      {/* Darkens the top (header), left (headline) and bottom (corner copy) so all stay readable. The
          bottom fades all the way to ink, so the photo dissolves into the dark section below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgb(21 18 15 / 0.55) 0%, rgb(21 18 15 / 0) 22%), linear-gradient(to right, rgb(21 18 15 / 0.8) 0%, rgb(21 18 15 / 0.35) 50%, rgb(21 18 15 / 0) 100%), linear-gradient(to top, rgb(21 18 15) 0%, rgb(21 18 15 / 0.92) 10%, rgb(21 18 15 / 0.6) 28%, rgb(21 18 15 / 0) 55%)",
        }}
      />
    </section>
  );
}
