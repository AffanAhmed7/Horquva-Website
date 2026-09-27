"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Opens a photo from a narrow crop to full frame as it scrolls into view. */
export function RevealImage({ children, className = "" }: { children: ReactNode; className?: string }) {
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
        gsap.fromTo(el, { clipPath: "inset(8% 5% 8% 5%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger });
        if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger });
      }, el);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
