"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Service } from "@/content/services";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  services: Service[];
  title: ReactNode;
  lead?: ReactNode;
  /** Link shown beside the arrows, e.g. to the full services page. */
  allHref?: string;
};

/**
 * Services as a row of tall cards that scrolls sideways (drag, swipe, trackpad or the arrow
 * buttons). Each card: photo, name, one-line summary and a link.
 */
export function ServiceCards({ services, title, lead, allHref }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);
  const reduced = useReducedMotion();
  const scrollByCard = useRef<(dir: 1 | -1) => void>(() => {});

  /*
   * Horizontal scrolling is eased by hand: every input (arrows, trackpad/shift-wheel, mouse drag)
   * moves a target, and a rAF loop glides scrollLeft towards it. Vertical wheel is left alone so
   * Lenis keeps scrolling the page when the cursor is over the cards. Touch stays native.
   */
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ease = reduced ? 1 : 0.085;

    let current = el.scrollLeft;
    let target = current;
    let frame = 0;
    let self = false; // scroll events we caused ourselves

    const max = () => el.scrollWidth - el.clientWidth;
    const clamp = (v: number) => Math.min(Math.max(v, 0), max());
    const updateEdge = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft > max() - 8 });

    const step = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.5) current = target;
      self = true;
      el.scrollLeft = current;
      frame = current === target ? 0 : requestAnimationFrame(step);
    };
    const glideTo = (x: number) => {
      target = clamp(x);
      if (!frame) frame = requestAnimationFrame(step);
    };

    // Card positions for settling after a drag or arrow press.
    const stops = () => {
      const first = el.querySelector("li");
      if (!first) return [0];
      const pad = first.offsetLeft;
      return Array.from(el.children, (li) => clamp((li as HTMLElement).offsetLeft - pad));
    };
    const nearest = (x: number) => stops().reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));

    scrollByCard.current = (dir) => {
      const s = stops();
      const next = dir > 0 ? s.find((x) => x > target + 4) : [...s].reverse().find((x) => x < target - 4);
      glideTo(next ?? (dir > 0 ? max() : 0));
    };

    const onScroll = () => {
      // Native scrolling (touch, keyboard, scrollbar) resyncs the loop.
      if (!self && !frame) current = target = el.scrollLeft;
      self = false;
      updateEdge();
    };

    const onWheel = (e: WheelEvent) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return; // vertical: let the page scroll
      const x = clamp(target + dx);
      if (x === target && (x === 0 || x === max())) return; // at an end: hand back to the page
      e.preventDefault();
      e.stopPropagation(); // keep Lenis from also moving the page
      glideTo(x);
    };

    // Mouse drag with a little momentum, then settle on the nearest card.
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let moved = false;
    let down = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      lastT = performance.now();
      startScroll = target;
      velocity = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        setDragging(true);
      }
      if (!moved) return;
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      velocity = 0.8 * velocity + 0.2 * ((e.clientX - lastX) / dt);
      lastX = e.clientX;
      lastT = now;
      glideTo(startScroll - dx * 1.1);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      setDragging(false);
      glideTo(nearest(target - velocity * 320));
    };
    // A drag should not also open the card it ended on.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onDragStart = (e: DragEvent) => e.preventDefault();
    const onResize = () => {
      current = target = clamp(el.scrollLeft);
      updateEdge();
    };

    updateEdge();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  const arrow =
    "flex h-12 w-12 items-center justify-center border border-rule text-[20px] transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div className="gutter mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl grow">
          {title}
          {lead && <div className="mt-5 text-[18px] leading-[1.5] text-ink-soft">{lead}</div>}
        </div>
        <div className="flex items-center gap-6">
          {allHref && (
            <Link
              href={allHref}
              className="text-[15px] underline decoration-bronze underline-offset-[6px] hover:decoration-2"
            >
              All services
            </Link>
          )}
          <div className="hidden gap-2 md:flex">
            <button type="button" className={arrow} onClick={() => scrollByCard.current(-1)} disabled={edge.start} aria-label="Previous services">
              ←
            </button>
            <button type="button" className={arrow} onClick={() => scrollByCard.current(1)} disabled={edge.end} aria-label="Next services">
              →
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        className={`mt-12 flex gap-6 overflow-x-auto overscroll-x-contain pb-10 pt-2 [scrollbar-width:none] lg:gap-8 [@media(pointer:coarse)]:snap-x [@media(pointer:coarse)]:snap-mandatory [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{
          paddingInline: "max(clamp(1rem,4vw,3.5rem), calc((100vw - 1440px) / 2 + clamp(1rem,4vw,3.5rem)))",
          scrollPaddingInline: "max(clamp(1rem,4vw,3.5rem), calc((100vw - 1440px) / 2 + clamp(1rem,4vw,3.5rem)))",
        }}
        aria-label="Services"
      >
        {services.map((s) => {
          return (
            <li key={s.slug} className="w-[78vw] max-w-[21rem] shrink-0 snap-start sm:w-[20rem] lg:w-[21rem]">
              <Link
                href={`/services/${s.slug}`}
                draggable={false}
                className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-[#FBF9F5] shadow-[0_1px_2px_rgba(20,16,10,0.04),0_12px_32px_-12px_rgba(20,16,10,0.12)] ring-1 ring-rule transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(20,16,10,0.05),0_24px_48px_-16px_rgba(20,16,10,0.22)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    draggable={false}
                    sizes="(min-width: 640px) 336px, 78vw"
                    unoptimized={s.photo.src.startsWith("http")}
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[28px] font-medium leading-[1.12] tracking-[-0.025em]">{s.name}</h3>
                  <p className="mt-3 text-[16px] leading-[1.45] text-ink-soft">{s.summary}</p>
                  <span className="mt-auto flex items-center gap-2 pt-8 text-[13px] font-semibold uppercase tracking-[0.04em]">
                    Learn more
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
