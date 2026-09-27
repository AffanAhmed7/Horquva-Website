import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "16/9". */
  ratio: string;
  className?: string;
  /** Preload in <head>: use only for the page's LCP image. */
  priority?: boolean;
  sizes?: string;
};

/** A graded photograph in a fixed-ratio frame. With no src it renders a quiet ink block. */
export function Photo({ src, alt, ratio, className = "", priority, sizes = "100vw" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          preload={priority}
          sizes={sizes}
          unoptimized={src.startsWith("http")}
          className="object-cover"
        />
      ) : (
        <span className="sr-only">{alt}</span>
      )}
    </div>
  );
}
