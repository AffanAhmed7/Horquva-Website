import Link from "next/link";
import type { ReactNode } from "react";

type Props = { href: string; children: ReactNode; className?: string; external?: boolean };

export function TextLink({ href, children, className = "", external }: Props) {
  const cls = `underline decoration-bronze decoration-1 underline-offset-[6px] transition-[text-decoration-thickness] duration-200 hover:decoration-2 ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
