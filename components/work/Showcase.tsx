import type { Client, Screen } from "@/content/work";
import { Screenshot } from "./Screenshot";

/**
 * The client's main screens on the page's own paper tone, composed like a product shot: the main screen large,
 * with a phone or a second screen overlapping its lower corner.
 */
export function Showcase({ client, preload }: { client: Client; preload?: boolean }) {
  const { main, phone, second } = client.showcase;

  return (
    <div className="relative pb-6 pt-2 md:pb-8">
      <Screenshot
        screen={main}
        preload={preload}
        sizes="(min-width: 1440px) 720px, (min-width: 768px) 52vw, 90vw"
        className={phone ? "w-[78%] md:w-[86%]" : second ? "w-[88%] md:w-[82%]" : "w-full"}
      />
      {phone && (
        <Screenshot
          screen={phone}
          sizes="(min-width: 768px) 14vw, 28vw"
          className="absolute bottom-0 right-0 w-[26%] md:w-[18%]"
          imageClassName="rounded-[1rem]"
        />
      )}
      {second && (
        <Screenshot
          screen={second}
          sizes="(min-width: 1440px) 480px, (min-width: 768px) 36vw, 62vw"
          className="relative -mt-[10%] ml-auto w-[72%] md:-mt-[14%] md:w-[64%]"
        />
      )}
    </div>
  );
}

/** Screens of one part of the work: one shown large, or several two to a row (stacked on phones). */
export function ScreenGallery({ screens, label }: { screens: Screen[]; label: string }) {
  const single = screens.length === 1;
  return (
    <ul className={`grid gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8 ${single ? "" : "sm:grid-cols-2"}`} aria-label={label}>
      {screens.map((s) => (
        <li key={s.src}>
          <Screenshot
            screen={s}
            ratio={single ? undefined : "16/10"}
            sizes={single ? "(min-width: 1440px) 620px, (min-width: 768px) 50vw, 90vw" : "(min-width: 1440px) 300px, (min-width: 768px) 24vw, (min-width: 640px) 44vw, 90vw"}
            imageClassName="shadow-[0_14px_36px_-18px_rgba(21,18,15,0.45)]"
          />
        </li>
      ))}
    </ul>
  );
}
