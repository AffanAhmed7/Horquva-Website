"use client";

import Link from "next/link";
import { useEffect } from "react";
import { nav, site } from "@/content/site";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-ink text-paper md:top-20 lg:hidden"
      data-lenis-prevent=""
    >
      <nav aria-label="Mobile" className="gutter flex min-h-full flex-col justify-between py-10">
        <ul className="space-y-1">
          {[...nav, { href: "/contact", label: "Start a project" }].map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClose} className="text-title block py-2 hover:text-bronze">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 space-y-1 text-stone">
          <a href={`mailto:${site.email}`} className="block hover:text-paper">
            {site.email}
          </a>
          <p>{site.city}</p>
        </div>
      </nav>
    </div>
  );
}
