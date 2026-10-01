"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const steps: { label: string; title: string; body: string; icon: ReactNode }[] = [
  {
    label: "Connect",
    title: "Plug into what you already use.",
    body: "Read-only links to your HR system, project tools and code. Nothing to migrate, nothing to type in twice.",
    icon: (
      <>
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </>
    ),
  },
  {
    label: "Map",
    title: "See it all in one place.",
    body: "People, processes, systems, vendors and AI agents, pulled together into one picture you can trust.",
    icon: (
      <>
        <path d="M12 3.5l8.5 4.5L12 12.5 3.5 8 12 3.5z" />
        <path d="M3.5 12L12 16.5 20.5 12" />
        <path d="M3.5 16L12 20.5 20.5 16" />
      </>
    ),
  },
  {
    label: "Understand",
    title: "Find where it would break.",
    body: "Spot the work that rests on one person, the systems with no backup and the links nobody wrote down.",
    icon: (
      <>
        <circle cx="6" cy="12" r="2.25" />
        <circle cx="18" cy="6" r="2.25" />
        <circle cx="18" cy="18" r="2.25" />
        <path d="M8 11l8-4M8 13l8 4" />
      </>
    ),
  },
  {
    label: "Simulate",
    title: "Try the change first.",
    body: "See what happens if someone leaves, a vendor changes or a model is swapped, before it happens for real.",
    icon: (
      <>
        <circle cx="6" cy="5.5" r="2.25" />
        <circle cx="6" cy="18.5" r="2.25" />
        <circle cx="18" cy="8" r="2.25" />
        <path d="M6 7.75v8.5M18 10.25c0 4-6 3.5-11 6.5" />
      </>
    ),
  },
  {
    label: "Act",
    title: "Fix it, and show your working.",
    body: "Clear, ranked next steps, with the evidence behind each one ready for your leadership team.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

/** How long the line takes to cross all the steps, in ms. */
const RUN = 1800;
const n = steps.length;
/** When the line reaches step i. */
const reach = (i: number) => (i / (n - 1)) * RUN;

/**
 * OBA Core's five steps on one line. When it first scrolls into view a bronze line rushes from the
 * first step to the last (top to bottom on small screens), lighting each step as it arrives and
 * bringing its words in behind it. Under reduced motion everything is shown lit and still.
 */
export function HowItWorks({ className = "" }: { className?: string }) {
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const on = seen || reduced;
  const delay = (ms: number) => ({ transitionDelay: on && !reduced ? `${ms}ms` : "0ms" });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Desktop line: from the first circle's centre to the last's, with a bright head leading the fill. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[10%] top-8 hidden h-px md:block">
        <span className="absolute inset-0 bg-rule-dark" />
        <span
          className={`absolute inset-0 origin-left bg-gradient-to-r from-bronze/40 via-bronze to-bronze transition-transform ease-linear ${
            on ? "scale-x-100" : "scale-x-0"
          }`}
          style={{ transitionDuration: reduced ? "0ms" : `${RUN}ms` }}
        />
        <span
          className={`absolute top-1/2 -ml-8 h-[3px] w-16 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#f0d6b8,rgba(169,130,90,0.6),transparent)] transition-[left,opacity] ease-linear ${
            on ? "left-full" : "left-0"
          } ${on && !reduced ? "animate-[oba-head-out_400ms_ease-out_forwards]" : "opacity-0"}`}
          style={{
            transitionDuration: reduced ? "0ms" : `${RUN}ms`,
            animationDelay: `${RUN}ms`,
          }}
        />
      </div>

      <ol aria-label="How OBA Core works" className="relative md:grid md:grid-cols-5 md:gap-6">
        {steps.map((s, i) => {
          const at = reach(i);
          return (
            <li key={s.label} className="relative grid grid-cols-[4rem_1fr] gap-x-5 pb-10 last:pb-0 md:block md:pb-0 md:text-center">
              {/* Mobile line: one segment down to the next step, filling in turn. */}
              {i < n - 1 && (
                <span aria-hidden className="absolute bottom-0 left-8 top-8 w-px bg-rule-dark md:hidden">
                  <span
                    className={`absolute inset-0 origin-top bg-bronze transition-transform ease-linear ${
                      on ? "scale-y-100" : "scale-y-0"
                    }`}
                    style={{ ...delay(at), transitionDuration: reduced ? "0ms" : `${RUN / (n - 1)}ms` }}
                  />
                </span>
              )}

              {/* The step's circle lights as the line reaches it. */}
              <span
                className={`relative z-10 grid size-16 place-items-center rounded-full bg-ink ring-1 ring-inset transition-[color,box-shadow,transform] duration-500 ease-out-expo md:mx-auto ${
                  on
                    ? "scale-100 text-bronze shadow-[0_0_0_6px_rgba(169,130,90,0.06),0_0_32px_-4px_rgba(169,130,90,0.45)] ring-bronze/60"
                    : "scale-90 text-stone/50 ring-rule-dark"
                }`}
                style={delay(at)}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </span>

              <div
                className={`pt-1 transition-[opacity,transform,filter] duration-700 ease-out-expo md:mx-auto md:max-w-[17rem] md:pt-8 ${
                  on ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[2px]"
                }`}
                style={delay(at + 120)}
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-bronze">{s.label}</p>
                <h3 className="mt-3 font-display text-[17px] font-normal leading-snug tracking-[-0.01em] text-paper md:text-[18px]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-stone">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
