import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "Horquva",
  description: "Horquva builds the software and AI systems businesses depend on.",
};

// Runs before paint: lets reveal-animated text start hidden only when motion is allowed.
const motionScript = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={hanken.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <SmoothScroll />
      </body>
    </html>
  );
}
