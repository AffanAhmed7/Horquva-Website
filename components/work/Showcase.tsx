import type { Client } from "@/content/work";
import { BrowserFrame } from "./BrowserFrame";
import { PhoneFrame } from "./PhoneFrame";

const tones = {
  ink: "bg-ink",
  bronze: "bg-[linear-gradient(160deg,#6b4a34_0%,#5e3f2c_45%,#3b281c_100%)]",
  sand: "bg-[#e4dacb]",
};

const glows = {
  ink: "bg-[radial-gradient(ellipse_60%_55%_at_70%_0%,rgba(169,130,90,0.35),transparent_70%)]",
  bronze: "bg-[radial-gradient(ellipse_55%_50%_at_20%_0%,rgba(226,195,160,0.35),transparent_70%)]",
  sand: "bg-[radial-gradient(ellipse_60%_55%_at_80%_0%,rgba(255,255,255,0.7),transparent_70%)]",
};

/**
 * The client's screens on a tinted panel, composed like a product shot: the main screen large, with
 * a phone or a second screen overlapping its lower corner. Any gallery screens follow in a row.
 */
export function Showcase({ client }: { client: Client }) {
  const { tone, main, phone, second, gallery } = client.showcase;

  return (
    <div>
      <div className={`relative isolate overflow-hidden rounded-[1.5rem] md:rounded-[2rem] ${tones[tone]}`}>
        <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${glows[tone]}`} />
        <div className="relative px-5 pb-14 pt-10 sm:px-10 md:px-16 md:pb-24 md:pt-16 lg:px-24">
          <BrowserFrame
            screen={main}
            sizes="(min-width: 1440px) 1000px, (min-width: 768px) 72vw, 88vw"
            className={phone ? "w-[88%] md:w-[80%]" : second ? "w-[86%] md:w-[74%]" : "w-full"}
          />
          {phone && (
            <PhoneFrame
              screen={phone}
              sizes="(min-width: 768px) 18vw, 28vw"
              className="absolute bottom-6 right-5 w-[27%] sm:right-10 md:bottom-12 md:right-16 md:w-[20%] lg:right-24"
            />
          )}
          {second && (
            <BrowserFrame
              screen={second}
              sizes="(min-width: 1440px) 640px, (min-width: 768px) 46vw, 60vw"
              className="relative -mt-[18%] ml-auto w-[64%] md:-mt-[22%] md:w-[52%]"
            />
          )}
        </div>
      </div>

      {gallery && (
        <ul className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-4 md:gap-5" aria-label={`More screens from ${client.name}`}>
          {gallery.map((s) => (
            <li key={s.src}>
              <BrowserFrame screen={s} sizes="(min-width: 768px) 24vw, 46vw" className="shadow-none" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
