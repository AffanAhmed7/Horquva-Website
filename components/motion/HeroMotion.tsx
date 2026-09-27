"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Background photo for the hero, on two layers so the effects don't fight:
 * - scroll layer: zooms and drifts as the hero scrolls away, while the foreground lifts and fades;
 * - pointer layer: settles in on load, then shifts gently against the cursor on devices with a mouse.
 * Static under reduced motion.
 */
export function HeroMotion({ media, children }: { media: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const scrollLayer = useRef<HTMLDivElement>(null);
  const pointerLayer = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    // The wrapper uses display: contents, so measure the hero section it sits in.
    const section = el?.parentElement;
    if (!el || !section || reduced) return;
    let cancelled = false;
    let revert = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const scrollTrigger = { trigger: section, start: "top top", end: "bottom top", scrub: 0.4 };
        // Load settle lives on the pointer layer (scale only) so it never fights the scroll tween.
        gsap.fromTo(pointerLayer.current, { scale: 1.14 }, { scale: 1, duration: 2.4, ease: "power3.out" });
        gsap.fromTo(
          scrollLayer.current,
          { scale: 1, yPercent: 0 },
          { scale: 1.22, yPercent: 28, ease: "none", scrollTrigger },
        );
        gsap.fromTo(contentRef.current, { y: 0, opacity: 1 }, { y: -140, opacity: 0, ease: "none", scrollTrigger });
      }, el);

      // Pointer parallax: the photo moves up to ~2% against the cursor.
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const toX = gsap.quickTo(pointerLayer.current, "xPercent", { duration: 1.2, ease: "power3.out" });
        const toY = gsap.quickTo(pointerLayer.current, "yPercent", { duration: 1.2, ease: "power3.out" });
        onMove = (e) => {
          const r = section.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          toX(nx * -4);
          toY(ny * -4);
        };
        section.addEventListener("pointermove", onMove);
      }

      revert = () => {
        if (onMove) section.removeEventListener("pointermove", onMove);
        ctx.revert();
        gsap.set(pointerLayer.current, { clearProps: "transform" });
      };
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced]);

  return (
    <div ref={root} className="contents">
      <div ref={scrollLayer} data-hero-scroll="" className="absolute inset-0 -z-20 will-change-transform">
        {/* Slightly oversized so pointer movement never reveals the edges. */}
        <div ref={pointerLayer} data-hero-pointer="" className="absolute -inset-[3%] will-change-transform">
          {media}
        </div>
      </div>
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
