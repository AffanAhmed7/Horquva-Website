"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Background photo for the hero: settles in on load, then drifts slower than the page
 * as you scroll (parallax) while the foreground content lifts away. Static under reduced motion.
 */
export function HeroMotion({ media, children }: { media: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    let cancelled = false;
    let revert = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.fromTo(mediaRef.current, { scale: 1.14 }, { scale: 1.04, duration: 2.2, ease: "power2.out" });
        // The wrapper uses display: contents, so measure the hero section it sits in.
        const scrollTrigger = { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true };
        gsap.fromTo(mediaRef.current, { yPercent: 0 }, { yPercent: 22, ease: "none", scrollTrigger });
        gsap.fromTo(contentRef.current, { y: 0, opacity: 1 }, { y: -80, opacity: 0.2, ease: "none", scrollTrigger });
      }, el);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced]);

  return (
    <div ref={root} className="contents">
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
        {media}
      </div>
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
