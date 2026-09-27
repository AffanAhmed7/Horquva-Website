"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const screens = [
  {
    src: "/photos/oba/overview.png",
    width: 1516,
    height: 724,
    title: "Overview",
    body: "The whole organisation at a glance: an intelligence score with the reasoning behind it, org health and critical agents.",
    alt: "OBA Core executive command center: an organisational intelligence score of 79, its assessment and recommendations, and cards for org health, agents found, orphaned and critical agents",
  },
  {
    src: "/photos/oba/agent.png",
    width: 1270,
    height: 709,
    title: "Ask the agent",
    body: "Ask in plain language, like “What happens if Sophia Chen leaves?”, and see exactly how it got the answer.",
    alt: "The OBA agent answering what happens if Sophia Chen leaves, listing the agents and workflows affected",
  },
  {
    src: "/photos/oba/continuity.png",
    width: 1238,
    height: 641,
    title: "Continuity",
    body: "Simulate someone leaving, or a tool going down, and see the health score move before it happens.",
    alt: "Continuity simulation: if Yuki Tanaka leaves, the health score drops from 63 to 58",
  },
  {
    src: "/photos/oba/ownership.png",
    width: 1234,
    height: 645,
    title: "Ownership",
    body: "Find single points of failure, coverage gaps and who is really accountable for each process.",
    alt: "Ownership intelligence: owners, coverage gaps and a responsibility matrix with duty conflicts flagged",
  },
  {
    src: "/photos/oba/dependencies.png",
    width: 1258,
    height: 714,
    title: "Dependency map",
    body: "Follow a failure downstream through every agent and workflow it touches.",
    alt: "Dependency map of agents and their owners, with risk levels on each node",
  },
  {
    src: "/photos/oba/org-science.png",
    width: 1216,
    height: 654,
    title: "Org science",
    body: "Measure how work really gets done: collaboration, learning and the patterns underneath.",
    alt: "Org science scores for collaboration, learning maturity and pattern regularity",
  },
];

/** How long each feature stays selected, in ms. */
const DWELL = 6000;

type Props = {
  className?: string;
  priority?: boolean;
  /** The background the tour sits on. */
  tone?: "paper" | "ink";
};

const tones = {
  paper: { track: "bg-rule", on: "text-ink", off: "text-ink-soft/70 hover:text-ink", body: "text-ink-soft", glow: "rgba(169,130,90,0.28)" },
  ink: { track: "bg-rule-dark", on: "text-paper", off: "text-stone hover:text-paper", body: "text-stone", glow: "rgba(169,130,90,0.38)" },
};

/**
 * A feature tour of OBA Core: a list of features beside one large product window. The selected
 * feature's line fills as a timer, then the next is selected and the window dissolves to its
 * screen. It pauses while off screen (not on hover: the cursor often rests over it, and a page
 * scrolling under a still cursor never reports it leaving). Clicking a feature selects it. Screens
 * are shown whole, never cropped. Under reduced motion nothing advances by itself.
 */
export function ProductTour({ className = "", priority, tone = "paper" }: Props) {
  const t = tones[tone];
  const n = screens.length;
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  // Entrance: plays once, the first time the tour comes into view; the timer starts after it.
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setEntered(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, [entered]);

  const running = !reduced && visible && ready;
  const shown = entered || reduced;

  return (
    <div
      ref={ref}
      className={`flex flex-col-reverse gap-10 md:grid md:grid-cols-12 md:items-center md:gap-10 ${className}`}
    >
      {/* Features. */}
      <ul className="md:col-span-4" role="tablist" aria-label="OBA Core features" aria-orientation="vertical">
        {screens.map((s, i) => {
          const on = i === active;
          return (
            <li
              key={s.src}
              role="presentation"
              className={`relative pl-6 transition-[opacity,transform] duration-700 ease-out-expo ${
                shown ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: shown ? `${250 + i * 90}ms` : "0ms" }}
            >
              {/* Track, with the timer filling down it for the selected feature. */}
              <span aria-hidden className={`absolute inset-y-0 left-0 w-[2px] ${t.track}`}>
                {on && (
                  <span
                    key={active}
                    className="absolute inset-0 origin-top bg-bronze"
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `tour-fill ${DWELL}ms linear forwards`,
                            animationPlayState: running ? "running" : "paused",
                          }
                    }
                    onAnimationEnd={() => setActive((a) => (a + 1) % n)}
                  />
                )}
              </span>
              <button
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="oba-tour-window"
                onClick={() => setActive(i)}
                className={`block w-full py-3 text-left font-display text-[19px] leading-tight transition-colors duration-300 md:text-[20px] ${
                  on ? t.on : t.off
                }`}
              >
                {s.title}
              </button>
              {/* Description opens under the selected feature. */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
                  on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className={`pb-4 text-[15px] leading-[1.55] ${t.body}`}>{s.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* The product window. */}
      <div
        className={`relative isolate transition-[opacity,transform,filter] duration-[1100ms] ease-out-expo md:col-span-8 ${
          shown ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-10 scale-[0.97] opacity-0 blur-sm"
        }`}
      >
        <div
          aria-hidden
          className="absolute inset-[-7%] -z-10 blur-2xl"
          style={{ background: `radial-gradient(ellipse 55% 50% at 50% 55%, ${t.glow}, transparent 75%)` }}
        />
        <div
          id="oba-tour-window"
          role="tabpanel"
          className="overflow-hidden rounded-[1rem] bg-[#e9ebef] shadow-[0_2px_4px_rgba(20,16,10,0.06),0_40px_80px_-28px_rgba(20,16,10,0.42)] ring-1 ring-black/5"
        >
          {/* Every screen shares one frame; the selected one dissolves in, uncropped. */}
          <div className="relative aspect-[1258/714]">
            {screens.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.src}
                  aria-hidden={!on}
                  className={`absolute inset-0 transition-[opacity,transform,filter] duration-[800ms] ease-out-expo ${
                    on ? "scale-100 opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-[6px]"
                  }`}
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1440px) 880px, (min-width: 768px) 64vw, 92vw"
                    preload={priority && i === 0}
                    unoptimized
                    className="object-contain object-top"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
