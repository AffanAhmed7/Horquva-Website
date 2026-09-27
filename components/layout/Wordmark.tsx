import Image from "next/image";
import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Horquva home">
      <Image src="/logo-mark.png" alt="" width={16} height={22} priority />
      <span className="text-[15px] font-semibold tracking-[0.14em]">HORQUVA</span>
    </Link>
  );
}
