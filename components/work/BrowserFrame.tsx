import Image from "next/image";
import type { Screen } from "@/content/work";

type Props = {
  screen: Screen;
  sizes: string;
  className?: string;
  preload?: boolean;
  /** Leave the image out of the accessibility tree when its text label sits right beside it. */
  decorative?: boolean;
  /** Crop to this CSS aspect ratio from the top, so frames of different screens line up. */
  ratio?: string;
};

/** A screenshot in a plain browser window: three dots and the address, nothing else. */
export function BrowserFrame({ screen, sizes, className = "", preload, decorative, ratio }: Props) {
  return (
    <div
      className={`overflow-hidden rounded-[0.9rem] bg-white shadow-[0_40px_90px_-30px_rgba(21,18,15,0.6)] ring-1 ring-ink/10 ${className}`}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-ink/[0.06] bg-[#efebe4] px-3 md:h-8">
        <span aria-hidden className="h-2 w-2 rounded-full bg-ink/15" />
        <span aria-hidden className="h-2 w-2 rounded-full bg-ink/15" />
        <span aria-hidden className="h-2 w-2 rounded-full bg-ink/15" />
        <span className="mx-auto truncate rounded-full bg-white/80 px-3 py-0.5 text-[11px] text-ink-soft md:text-[12px]">
          {screen.label}
        </span>
        {/* Balances the dots so the address stays centred. */}
        <span aria-hidden className="w-[30px]" />
      </div>
      <Image
        src={screen.src}
        alt={decorative ? "" : screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={sizes}
        preload={preload}
        className={`block w-full ${ratio ? "object-cover object-top" : "h-auto"}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
      />
    </div>
  );
}
