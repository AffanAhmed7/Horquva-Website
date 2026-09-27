"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Service } from "@/content/services";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The services as a large-type index. On pointer devices the hovered service's
 * photograph follows the cursor; on touch devices a small thumbnail sits in the row.
 */
export function ServiceIndex({ services }: { services: Service[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const reduced = useReducedMotion();
  const hovering = active !== null;

  const follower = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Ease the photo toward the pointer each frame; jump straight there under reduced motion.
  useEffect(() => {
    if (!canHover || !hovering) return;
    const pos = { ...target.current };
    let frame = 0;
    const loop = () => {
      const k = reduced ? 1 : 0.18;
      pos.x += (target.current.x - pos.x) * k;
      pos.y += (target.current.y - pos.y) * k;
      if (follower.current) {
        follower.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [canHover, reduced, hovering]);

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        target.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="border-t border-rule">
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-rule">
            <Link
              href={`/services/${s.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 transition-colors duration-300 md:grid-cols-[4rem_1fr_auto] md:py-8 ${
                active !== null && active !== i ? "text-stone" : ""
              }`}
            >
              <span className="text-[15px] text-bronze-deep tabular-nums">{s.number}</span>
              <span>
                <span className="text-heading block transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  {s.name}
                </span>
                <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out-expo md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                  <span className="overflow-hidden">
                    <span className="block max-w-xl pt-3 text-[16px] text-ink-soft">{s.summary}</span>
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-4 self-center">
                {!canHover && (
                  <span className="relative block h-14 w-11 overflow-hidden bg-ink md:h-16 md:w-12">
                    <Image src={s.photo.src} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                )}
                <span
                  aria-hidden
                  className="text-[22px] transition-transform duration-300 group-hover:translate-x-1 max-sm:hidden"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {canHover && (
        <div
          ref={follower}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-20 h-[22rem] w-[17.5rem] will-change-transform"
        >
          <div
            className={`relative h-full w-full overflow-hidden bg-ink transition-[opacity,scale] duration-200 ${
              active === null ? "scale-[0.92] opacity-0" : "scale-100 opacity-100"
            }`}
          >
          {services.map((s, i) => (
            <Image
              key={s.slug}
              src={s.photo.src}
              alt=""
              fill
              sizes="280px"
              className={`object-cover transition-opacity duration-200 ${active === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
