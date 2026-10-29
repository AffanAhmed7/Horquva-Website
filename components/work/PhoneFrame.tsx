import Image from "next/image";
import type { Screen } from "@/content/work";

/** A phone-sized screenshot in a dark bezel. */
export function PhoneFrame({ screen, sizes, className = "" }: { screen: Screen; sizes: string; className?: string }) {
  return (
    <div
      className={`rounded-[2rem] bg-ink p-[5px] shadow-[0_40px_80px_-24px_rgba(21,18,15,0.7)] ring-1 ring-paper/15 md:rounded-[2.4rem] md:p-[7px] ${className}`}
    >
      <div className="overflow-hidden rounded-[1.65rem] md:rounded-[2rem]">
        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes={sizes} className="block h-auto w-full" />
      </div>
    </div>
  );
}
