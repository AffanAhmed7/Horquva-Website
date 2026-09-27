"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

/** Pages that open with a full-bleed photo the header floats over. */
const heroPages = new Set(["/", "/oba-core", "/contact", "/approach", "/team", "/careers"]);

/** Whether the section behind the header is dark (sections mark themselves with data-tone). */
function darkUnderHeader(header: HTMLElement) {
  // Its middle, since that's what shows through the frosted background.
  const y = header.offsetHeight / 2;
  const below = document.elementsFromPoint(window.innerWidth / 2, y).find((el) => !header.contains(el));
  return below?.closest<HTMLElement>("[data-tone]")?.dataset.tone === "ink";
}

export function SiteHeader() {
  const pathname = usePathname();
  const hasHero = heroPages.has(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(hasHero);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const menuOpen = menuFor === pathname;

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header[data-surface]");
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (header) setDark(darkUnderHeader(header));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // The header always has light text and buttons, so its surface is always dark enough behind them:
  // clear over a dark opening, a light tint over dark sections, dark frosted glass over paper, and
  // solid ink at the top of pages that open on paper (and behind the ink mobile menu).
  const surface = menuOpen
    ? "bg-ink border-rule-dark"
    : !scrolled
      ? hasHero
        ? "bg-transparent border-transparent"
        : "bg-ink border-transparent"
      : dark
        ? "bg-ink/25 backdrop-blur-md border-paper/10"
        : "bg-ink/80 backdrop-blur-md border-paper/10";

  return (
    <>
      <header
        data-surface="dark"
        className={`fixed inset-x-0 top-0 z-40 border-b text-paper transition-[background-color,border-color,backdrop-filter] duration-300 ease-out-expo ${surface}`}
      >
        <div className="gutter mx-auto flex h-16 max-w-[1440px] items-center justify-between md:h-20">
          <Wordmark />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex gap-9 text-[15px]">
              {nav.map((item) => {
                const prefix = "activePrefix" in item ? item.activePrefix : item.href;
                const active = pathname === item.href || pathname.startsWith(`${prefix}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`decoration-bronze underline-offset-[6px] hover:underline ${active ? "underline" : ""}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Button href="/contact" variant="glass" tone="ink">
                Start a project
              </Button>
            </div>
            <button
              type="button"
              className="flex h-11 items-center gap-3 text-[15px] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuFor(menuOpen ? null : pathname)}
            >
              {menuOpen ? "Close" : "Menu"}
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuFor(null)} />
      {/* Pushes content below the fixed header, except where a hero sits underneath it. */}
      {!hasHero && <div aria-hidden className="h-16 md:h-20" />}
    </>
  );
}
