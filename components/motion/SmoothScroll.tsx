"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Links to a section on the current page glide there instead of jumping. Caught in the capture
      // phase and marked handled: Next's <Link> still runs its onClick (the mobile menu closes), but
      // skips its own instant jump for a click that's already been prevented.
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element | null)?.closest?.("a[href]");
        if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
        const url = new URL(a.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
        history.pushState(null, "", url.hash);
      };
      window.addEventListener("click", onClick, true);

      cleanup = () => {
        window.removeEventListener("click", onClick, true);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced]);

  return null;
}
