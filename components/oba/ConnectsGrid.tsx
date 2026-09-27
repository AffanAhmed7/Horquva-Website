"use client";

import type { PointerEvent, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<string, ReactNode> = {
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14.1c2.6.4 4.5 2.8 4.5 5.9" />
    </>
  ),
  agents: (
    <>
      <path d="M11 3.5l1.7 4.6 4.6 1.7-4.6 1.7L11 16.1l-1.7-4.6-4.6-1.7 4.6-1.7z" />
      <path d="M18 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  systems: (
    <>
      <rect x="3.5" y="4" width="17" height="6.5" rx="1.6" />
      <rect x="3.5" y="13.5" width="17" height="6.5" rx="1.6" />
      <path d="M7.5 7.25h.01M7.5 16.75h.01M11 7.25h5.5M11 16.75h5.5" />
    </>
  ),
  processes: (
    <>
      <circle cx="5.5" cy="6" r="2.2" />
      <circle cx="18.5" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M7.7 6h8.6M17.4 7.9l-4.3 8.2M6.6 7.9l4.3 8.2" />
    </>
  ),
  knowledge: (
    <>
      <path d="M4.5 19.5V5.5a2 2 0 0 1 2-2h13v15h-13a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13" />
      <path d="M8.5 7.5h7M8.5 11h5" />
    </>
  ),
  vendors: (
    <>
      <path d="M3 20.5h18M5 20.5V9l7-5 7 5v11.5" />
      <path d="M9.5 20.5v-5.5h5v5.5" />
    </>
  ),
};

const connects = [
  { icon: "people", title: "People", body: "Who owns what, who backs them up, and who is carrying too much." },
  { icon: "agents", title: "AI agents and models", body: "Which agents run where, who owns them, and what relies on them." },
  { icon: "systems", title: "Systems", body: "The software the organisation runs on, and how hard each one is to replace." },
  { icon: "processes", title: "Processes", body: "The workflows that matter, and every person and system each one touches." },
  { icon: "knowledge", title: "Knowledge", body: "Where know-how lives, and where it would be lost if someone left." },
  { icon: "vendors", title: "Vendors", body: "Outside providers, and what depends on them staying." },
];

/** Keeps the hovered card's spotlight under the cursor. */
function follow(e: PointerEvent<HTMLLIElement>) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--x", `${e.clientX - r.left}px`);
  card.style.setProperty("--y", `${e.clientY - r.top}px`);
}

/**
 * The six kinds of thing OBA Core connects, as a grid of cards on ink. Each has a fine-line icon;
 * a warm spotlight follows the cursor inside the card under it.
 */
export function ConnectsGrid() {
  return (
    <Reveal
      as="ul"
      stagger={0.08}
      className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] bg-rule-dark ring-1 ring-rule-dark sm:grid-cols-2 md:mt-20 lg:grid-cols-3"
    >
      {connects.map((c) => (
        <li
          key={c.title}
          onPointerMove={follow}
          className="group relative isolate overflow-hidden bg-ink p-8 md:p-10"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgba(169,130,90,0.16), transparent 65%)",
            }}
          />
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-bronze/10 text-bronze ring-1 ring-bronze/20 transition-[background-color,box-shadow] duration-500 group-hover:bg-bronze/20 group-hover:shadow-[0_0_24px_-4px_rgba(169,130,90,0.55)]"
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" {...stroke}>
              {icons[c.icon]}
            </svg>
          </span>
          <h3 className="mt-7 font-display text-[22px] leading-tight text-paper">{c.title}</h3>
          <p className="mt-3 text-[16px] leading-[1.55] text-stone">{c.body}</p>
        </li>
      ))}
    </Reveal>
  );
}
