"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = { children: ReactNode; className?: string; "aria-label"?: string };

/** A list whose items rise in one after another as it scrolls into view. Static under reduced motion. */
export function RevealList({ children, className = "", ...aria }: Props) {
  const ref = useRef<HTMLUListElement>(null);
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
      const ctx = gsap.context(() => {
        gsap.from(el.children, {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }, el);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced]);

  return (
    <ul ref={ref} className={className} {...aria}>
      {children}
    </ul>
  );
}
