"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
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
    gsap.registerPlugin(ScrollTrigger, SplitText);
    let split: SplitText | undefined;
    // Wait for web fonts so line breaks are measured with the real typeface.
    document.fonts.ready.then(() => {
      if (!ref.current) return;
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
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
    });
    return () => split?.revert();
  }, [reduced, delay]);

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
