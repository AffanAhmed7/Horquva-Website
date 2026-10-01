"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { nav, site } from "@/content/site";

const socials = [
  { label: "LinkedIn", href: site.linkedin },
  { label: "Instagram", href: site.instagram },
  { label: "Facebook", href: site.facebook },
];

/**
 * The small-screen menu: an ink sheet under the header with a bronze glow from the corner. Links
 * rise in one after another in the hero's light type, the current page carries a bronze marker,
 * and the ways to get in touch sit at the foot. It covers the Woba launcher while open.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  // Each piece follows the one before it in.
  const rise = (i: number) =>
    ({
      className: `transition-[opacity,transform,filter] duration-700 ease-out-expo ${
        open ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[3px]"
      }`,
      style: { transitionDelay: open ? `${80 + i * 55}ms` : "0ms" },
    }) as const;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-x-0 bottom-0 top-16 z-[47] overflow-y-auto bg-ink text-paper transition-opacity duration-300 ease-out-expo md:top-20 lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      data-lenis-prevent=""
      data-tone="ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[70vh] w-full bg-[radial-gradient(ellipse_70%_55%_at_85%_0%,rgba(169,130,90,0.22),transparent_75%)]"
      />

      <nav aria-label="Mobile" className="gutter relative flex min-h-full flex-col pb-8 pt-6">
        <ul className="border-t border-rule-dark">
          {nav.map((item, i) => {
            const prefix = "activePrefix" in item ? item.activePrefix : item.href;
            const active = pathname === item.href || pathname.startsWith(`${prefix}/`);
            const r = rise(i);
            return (
              <li key={item.href} className={`border-b border-rule-dark ${r.className}`} style={r.style}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center justify-between gap-6 py-4 font-display text-[clamp(1.875rem,8vw,2.75rem)] font-light leading-none tracking-[-0.025em] transition-colors duration-300 ${
                    active ? "text-paper" : "text-paper/65 hover:text-paper"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      aria-hidden
                      className={`size-2 shrink-0 rounded-full bg-bronze transition-[opacity,transform] duration-300 ${
                        active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                    <span className={`transition-transform duration-500 ease-out-expo ${active ? "" : "-ml-6"}`}>
                      {item.label}
                    </span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-5 shrink-0 text-bronze transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={rise(nav.length).style} className={`mt-8 ${rise(nav.length).className}`}>
          <Button href="/contact" tone="ink" onClick={onClose} className="w-full justify-between">
            Start a project
            <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Button>
        </div>

        <div
          style={rise(nav.length + 1).style}
          className={`mt-auto grid gap-6 pt-14 text-[15px] sm:grid-cols-2 ${rise(nav.length + 1).className}`}
        >
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-bronze">Say hello</p>
            <a href={`mailto:${site.email}`} className="mt-2 block text-paper underline decoration-bronze decoration-1 underline-offset-[6px]">
              {site.email}
            </a>
            <p className="mt-1 text-stone">
              {site.city}, {site.country}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-bronze">Follow</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-stone transition-colors hover:text-paper">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
