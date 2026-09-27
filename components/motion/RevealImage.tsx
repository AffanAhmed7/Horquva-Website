"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Also drift the photo inside its frame for as long as it is on screen. */
  parallax?: boolean;
};

/** Opens a photo from a narrow crop to full frame as it scrolls into view. */
export function RevealImage({ children, className = "", parallax = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let cancelled = false;
    let revert = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const img = el.querySelector("img");
      const ctx = gsap.context(() => {
        const scrollTrigger = { trigger: el, start: "top 95%", end: "top 35%", scrub: 0.6 };
        // Keep the frame's own rounded corners while the clip opens.
        const r = getComputedStyle(el).borderTopLeftRadius;
        const round = r && r !== "0px" ? ` round ${r}` : "";
        gsap.fromTo(
          el,
          { clipPath: `inset(8% 5% 8% 5%${round})` },
          { clipPath: `inset(0% 0% 0% 0%${round})`, ease: "none", scrollTrigger },
        );
        // With parallax the photo stays slightly enlarged so the drift never shows an edge.
        if (img) gsap.fromTo(img, { scale: parallax ? 1.3 : 1.12 }, { scale: parallax ? 1.16 : 1, ease: "none", scrollTrigger });
        if (img && parallax)
          gsap.fromTo(
            img,
            { yPercent: -6 },
            { yPercent: 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
      }, el);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced, parallax]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
