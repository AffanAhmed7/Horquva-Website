"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Seconds to wait once it's in view. */
  delay?: number;
  /** Animate the direct children one after another, this many seconds apart, instead of the whole block. */
  stagger?: number;
};

/** Fades and lifts content in, once, as it scrolls into view. Static under reduced motion. */
export function Reveal({ as: Tag = "div", className = "", children, delay = 0, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);
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
        gsap.from(stagger ? el.children : el, {
          y: 24,
          autoAlpha: 0,
          filter: "blur(6px)",
          duration: 1,
          ease: "power3.out",
          delay,
          stagger,
          clearProps: "filter,transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }, el);
      revert = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced, delay, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
