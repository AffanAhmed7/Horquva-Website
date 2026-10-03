import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { services } from "@/content/services";
import { nav, site } from "@/content/site";

const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: site.instagram,
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: site.linkedin,
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M8 10.5V16M8 7.9v.1M11.5 16v-3.2c0-1.5.9-2.3 2.1-2.3s1.9.8 1.9 2.3V16M11.5 10.5V16" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: site.facebook,
    icon: <path d="M14.5 3.5h-2a4 4 0 0 0-4 4v2.5h-2.5v3.5h2.5v7h3.5v-7h2.8l.7-3.5h-3.5v-2a1 1 0 0 1 1-1h2.5z" />,
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper" data-tone="ink">
      <div className="gutter mx-auto max-w-[1440px] pb-10">
        <div className="border-t border-rule-dark pt-16 md:pt-20">
          <div className="mb-14 flex flex-wrap items-center justify-between gap-8">
            <Link href="/" aria-label="Horquva home" className="inline-flex items-center gap-4">
              <Image src="/logo-mark.png" alt="" width={32} height={44} className="h-11 w-auto" />
              <span className="text-[22px] font-semibold tracking-[0.18em]">HORQUVA</span>
            </Link>
            <ul className="flex gap-3" aria-label="Horquva on social media">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-paper/80 ring-1 ring-paper/15 transition-colors duration-300 hover:bg-bronze hover:text-ink hover:ring-bronze"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-12 text-[15px] sm:grid-cols-2 lg:grid-cols-12">
            <p className="max-w-sm text-stone lg:col-span-5">{site.tagline}</p>
            <nav aria-label="Services" className="lg:col-span-3">
              <h2 className="mb-4 text-[15px] text-stone">Services</h2>
              <ul className="space-y-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="hover:text-bronze">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Company" className="lg:col-span-2">
              <h2 className="mb-4 text-[15px] text-stone">Company</h2>
              <ul className="space-y-2">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="hover:text-bronze">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-[15px] text-stone">Contact</h2>
              <ul className="space-y-2">
                <li>
                  <a href={`mailto:${site.email}`} className="hover:text-bronze">
                    {site.email}
                  </a>
                </li>
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-bronze">
                      {s.label}
                    </a>
                  </li>
                ))}
                <li className="text-stone">{site.city}</li>
              </ul>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap justify-between gap-4 text-[13px] text-stone">
            <p>
              © {year} {site.legalName} All rights reserved.
            </p>
            <Link href="/privacy" className="hover:text-paper">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
