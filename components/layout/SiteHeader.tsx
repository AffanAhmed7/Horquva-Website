"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

/** Pages that open with a full-bleed photo the header floats over. */
const heroPages = new Set(["/"]);

export function SiteHeader() {
  const pathname = usePathname();
  const hasHero = heroPages.has(pathname);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const menuOpen = menuFor === pathname;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setScrolled(y > 8);
      setPastHero(!hero || y > hero.offsetHeight - 80);
      setHidden(y > 160 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Transparent with light text while over the hero photo; solid paper everywhere else.
  const overlay = hasHero && !pastHero && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[transform,background-color,color,border-color] duration-300 ease-out-expo ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          overlay
            ? "border-transparent bg-transparent text-paper"
            : `bg-paper text-ink ${scrolled ? "border-rule" : "border-transparent"}`
        }`}
      >
        <div className="gutter mx-auto flex h-16 max-w-[1440px] items-center justify-between md:h-20">
          <Wordmark />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex gap-9 text-[15px]">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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
              <Button href="/contact" tone={overlay ? "ink" : "paper"}>
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
