import type { Client } from "@/content/work";
import { Screenshot } from "./Screenshot";

/**
 * The client's main screens on the page's own paper tone, composed like a product shot: the main screen large,
 * with a phone or a second screen overlapping its lower corner.
 */
export function Showcase({ client, preload }: { client: Client; preload?: boolean }) {
  const { main, phone, second } = client.showcase;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-paper">
      <div className="relative px-6 pb-10 pt-8 sm:px-10 md:pb-14 md:pt-10">
        <Screenshot
          screen={main}
          preload={preload}
          sizes="(min-width: 1440px) 620px, (min-width: 768px) 46vw, 80vw"
          className={phone ? "w-[78%]" : second ? "w-[76%]" : "w-full"}
        />
        {phone && (
          <Screenshot
            screen={phone}
            sizes="(min-width: 768px) 12vw, 24vw"
            className="absolute bottom-6 right-6 w-[22%] sm:right-10 md:bottom-8"
            imageClassName="rounded-[1rem]"
          />
        )}
        {second && (
          <Screenshot
            screen={second}
            sizes="(min-width: 1440px) 420px, (min-width: 768px) 32vw, 56vw"
            className="relative -mt-[14%] ml-auto w-[58%]"
          />
        )}
      </div>
    </div>
  );
}

/** More of the client's screens, two to a row, each named by the page it shows. */
export function ScreenGallery({ client }: { client: Client }) {
  const { gallery } = client.showcase;
  if (!gallery) return null;
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8" aria-label={`More screens from ${client.name}`}>
      {gallery.map((s) => (
        <li key={s.src}>
          <Screenshot screen={s} ratio="16/10" sizes="(min-width: 1440px) 300px, (min-width: 768px) 24vw, 44vw" imageClassName="shadow-[0_14px_36px_-18px_rgba(21,18,15,0.45)]" />
          <p className="mt-2.5 text-[14px] text-ink-soft">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}
