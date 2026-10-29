import Image from "next/image";
import type { Screen } from "@/content/work";

type Props = {
  screen: Screen;
  sizes: string;
  /** Size and position of the wrapper. The image always fills it. */
  className?: string;
  imageClassName?: string;
  preload?: boolean;
  /** Crop to this CSS aspect ratio from the top left, so screens of different shapes line up. */
  ratio?: string;
};

/** A screenshot with rounded corners and a soft shadow, and no frame or outline. */
export function Screenshot({ screen, sizes, className = "", imageClassName = "", preload, ratio }: Props) {
  return (
    <div className={className}>
      <Image
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={sizes}
        preload={preload}
        className={`block w-full rounded-[0.75rem] shadow-[0_24px_60px_-24px_rgba(21,18,15,0.5)] ${
          ratio ? "object-cover object-left-top" : "h-auto"
        } ${imageClassName}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
      />
    </div>
  );
}
