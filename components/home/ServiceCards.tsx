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
};

/**
 * Services as a row of tall cards that scrolls sideways (drag, swipe, trackpad or the arrow
 * buttons). Each card: photo, name, one-line summary and a link.
 */
export function ServiceCards({ services, title, lead }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);
  const reduced = useReducedMotion();
  const scrollByCard = useRef<(dir: 1 | -1) => void>(() => {});
  /** Locks the row (and eases it back to the first card) while the scroll intro is still playing. */
  const setLocked = useRef<(locked: boolean) => void>(() => {});

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

    let locked = false;
    setLocked.current = (next) => {
      if (next === locked) return;
      locked = next;
      // Hidden overflow also stops native touch scrolling; scrollLeft can still be set from code.
      el.style.overflowX = locked ? "hidden" : "";
      if (locked) glideTo(0);
    };

    scrollByCard.current = (dir) => {
      if (locked) return;
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
      if (locked) {
        e.preventDefault(); // no sideways scrolling until the cards are in
        return;
      }
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
      if (locked || e.pointerType !== "mouse" || e.button !== 0) return;
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

  /*
   * Scroll intro: the full-screen block pins with the title centred and enlarged over a small bronze
   * glow; scrolling spreads the glow, glides the title into its corner and brings the cards in one by
   * one. Scrubbed, so it follows the (Lenis-smoothed) scroll. Skipped under reduced motion.
   */
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const head = heading.current;
    const list = track.current;
    if (reduced || !el || !head || !list) return;
    let cancelled = false;
    let revert = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      await document.fonts.ready;
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Bounds of the rendered glyphs, not the full-width heading box.
      const textBox = () => {
        const walker = document.createTreeWalker(head, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        let l = Infinity, r = -Infinity;
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent?.trim()) continue;
          range.selectNodeContents(n);
          const box = range.getBoundingClientRect();
          l = Math.min(l, box.left);
          r = Math.max(r, box.right);
        }
        // Undo any transform already applied, so this is the resting position.
        const s = gsap.getProperty(head, "scale") as number;
        const dx = gsap.getProperty(head, "x") as number;
        const dy = gsap.getProperty(head, "y") as number;
        // Relative to the pinned block, whose centre lands on the viewport centre when pinned.
        // Vertical centre comes from the heading box: the line reveal may still be shifting the glyphs.
        const box = el.getBoundingClientRect();
        const own = head.getBoundingClientRect();
        return {
          left: own.left - dx - box.left, // scale origin
          offset: (l - own.left) / s, // glyphs may start inside the heading box
          width: (r - l) / s,
          midY: own.top + own.height / 2 - dy - box.top,
        };
      };
      const centre = () => ({ x: el.offsetWidth / 2, y: el.offsetHeight / 2 });
      // Enlarged, but never wider than 90% of the block.
      const scale = () =>
        Math.min(window.innerWidth < 768 ? 1.25 : 1.6, (el.offsetWidth * 0.9) / textBox().width);

      const ctx = gsap.context(() => {
        const cards = Array.from(list.children) as HTMLElement[];
        // How many cards fit in the row's viewport (partly visible ones count).
        const visible = () => {
          const pad = cards[0]?.offsetLeft ?? 0;
          return Math.max(1, cards.filter((c) => c.offsetLeft - pad < list.clientWidth).length);
        };
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: el,
            // Full-screen block pins at the top; if it's taller than a short screen, pin it centred.
            start: () => (el.offsetHeight > window.innerHeight ? "center center" : "top top"),
            end: () => `+=${Math.round(window.innerHeight * 1.5)}`,
            pin: true,
            scrub: 0.5, // Lenis already smooths the scroll; a short scrub keeps it responsive
            invalidateOnRefresh: true,
          },
        });
        // The bronze glow starts as a pool behind the title and spreads across the section.
        tl.fromTo(
          glow.current,
          { scale: 0.3, autoAlpha: 0.75 },
          { scale: 1.7, autoAlpha: 1, duration: 2, ease: "power2.inOut" },
          0,
        );
        // Scaled from its left edge, so centre the enlarged width, not the resting one.
        tl.from(
          head,
          {
            x: () => {
              const t = textBox();
              return centre().x - t.left - (t.offset + t.width / 2) * scale();
            },
            y: () => centre().y - textBox().midY,
            scale,
            transformOrigin: "0% 50%",
            duration: 1,
          },
          0,
        )
          .from(controls.current, { autoAlpha: 0, y: 16, duration: 0.4 }, 0.8)
          // The row rises into place while each card slides in from the right and scales up.
          // (Vertical offsets on the cards themselves would be clipped by the scrolling row.)
          .from(list, { y: 120, duration: 1, ease: "power3.out" }, 0.55)
          .from(
            cards,
            {
              x: (i) => 140 + Math.min(i, visible() - 1) * 40,
              autoAlpha: 0,
              scale: 0.86,
              duration: 0.9,
              ease: "power3.out",
              // Staggered across the cards on screen; the off-screen ones land with the last of
              // them, so the whole row is in place the moment the visible cards are.
              stagger: (i) => Math.min(i, visible() - 1) * 0.16,
            },
            0.6,
          )
          .addLabel("cardsIn")
          .to({}, { duration: 0.3 }); // brief hold before unpinning
        // Unlock the row as soon as the cards look settled (all of them, see the stagger above);
        // relock and rewind when scrolling back up into the intro. With power3.out they are ~96%
        // in at two thirds of their tween, so waiting for the very end made the row feel stuck.
        const cardsIn = tl.labels.cardsIn - 0.3;
        setLocked.current(true);
        tl.eventCallback("onUpdate", () => setLocked.current(tl.time() < cardsIn));
      }, el);
      // This pin is created after the reveals further down the page have measured themselves; its
      // spacer pushes them down, so re-sort and re-measure or they fire far too early.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      revert = () => {
        ctx.revert();
        setLocked.current(false);
      };
    })();
    return () => {
      cancelled = true;
      revert();
    };
  }, [reduced]);

  const arrow =
    "flex h-12 w-12 items-center justify-center border border-rule text-[20px] transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div ref={root} className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden py-24">
      {/* Warm bronze glow; the scroll intro spreads it from behind the title across the section. */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute -inset-[20%] -z-10 will-change-[transform,opacity]"
        style={{
          background: [
            "radial-gradient(ellipse 40% 34% at 70% 45%, rgba(94,63,44,0.22), transparent 75%)",
            "radial-gradient(ellipse 34% 30% at 26% 68%, rgba(120,80,50,0.18), transparent 75%)",
            "radial-gradient(ellipse 58% 52% at 48% 55%, rgba(169,130,90,0.42), rgba(169,130,90,0.24) 35%, rgba(169,130,90,0.10) 65%, transparent 90%)",
          ].join(", "),
        }}
      />
      <div className="gutter mx-auto flex w-full max-w-[1440px] flex-wrap items-end justify-between gap-8">
        <div ref={heading} className="max-w-2xl grow">
          {title}
          {lead && <div className="mt-5 text-[18px] leading-[1.5] text-ink-soft">{lead}</div>}
        </div>
        <div ref={controls} className="flex items-center">
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
                  <h3 className="font-display text-[23px] font-bold leading-[1.15] tracking-[-0.02em]">{s.name}</h3>
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
