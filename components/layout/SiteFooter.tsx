import Link from "next/link";
import { services } from "@/content/services";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="gutter mx-auto max-w-[1440px] pb-10">
        <div className="border-t border-rule-dark pt-24 md:pt-32">
        <a
          href={`mailto:${site.email}`}
          className="inline-block break-all text-[clamp(2.25rem,7vw,7rem)] font-medium leading-none tracking-[-0.035em] hover:text-bronze"
        >
          {site.email}
        </a>

        <div className="mt-20 grid gap-12 border-t border-rule-dark pt-10 text-[15px] sm:grid-cols-2 lg:grid-cols-12">
          <p className="max-w-sm text-stone lg:col-span-5">{site.description}</p>
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
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-bronze">
                  LinkedIn
                </a>
              </li>
              <li className="text-stone">{site.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap justify-between gap-4 text-[13px] text-stone">
          <p>
            © {year} {site.legalName}
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
