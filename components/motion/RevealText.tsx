"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
};

/** Reveals text line by line as it enters the viewport. Static under reduced motion or without JS. */
export function RevealText({ as: Tag = "h2", className = "", children, id, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.visibility = "visible";
      return;
    }
    let cancelled = false;
    let revert = () => {};
    // GSAP loads after hydration so it stays out of the critical bundle.
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      // Wait for web fonts so line breaks are measured with the real typeface.
      await document.fonts.ready;
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        // The text stays in the DOM as plain text, so no ARIA rewriting is needed.
        aria: "none",
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            delay,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        },
      });
      revert = () => split.revert();
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced, delay]);

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
