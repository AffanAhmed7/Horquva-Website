"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";

type WobaMessage = { id: string; role: "user" | "woba"; text: string };

const greeting = "Hi, I'm Woba. Ask me about our services, OBA Core, or how a project with Horquva works.";

const suggestions = [
  "What does Horquva build?",
  "Tell me about OBA Core",
  "How does a project start?",
  "How do I get in touch?",
];

let nextId = 0;
const makeId = () => `m${++nextId}`;

function Mark({ size, className = "" }: { size: number; className?: string }) {
  // The mark is taller than it is wide (427 × 584).
  return (
    <Image src="/logo-mark.png" alt="" width={Math.round(size * 0.73)} height={size} className={className} />
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Woba, Horquva's assistant. A bronze-ringed launcher in the corner opens a small ink panel in the
 * language of the dark sections: a bronze glow from above, and Woba's words hung off a bronze track
 * like the OBA product tour. One continuous conversation, opening with Woba's greeting.
 * UI only for now: nothing answers yet.
 */
export function WobaWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WobaMessage[]>([{ id: makeId(), role: "woba", text: greeting }]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const showSuggestions = messages.length === 1;
  const lastWoba = messages.findLastIndex((m) => m.role === "woba");

  function close() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { id: makeId(), role: "user", text: clean }]);
    setDraft("");
    inputRef.current?.focus();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
  }

  return (
    <>
      <section
        id="woba-panel"
        role="dialog"
        aria-label="Chat with Woba"
        inert={!open}
        data-lenis-prevent=""
        data-tone="ink"
        className={`fixed bottom-24 right-4 z-[45] flex h-[min(70dvh,500px)] w-[calc(100vw-2rem)] max-w-[360px] origin-bottom-right flex-col overflow-hidden rounded-[1.125rem] bg-ink/95 text-paper shadow-[0_2px_4px_rgba(20,16,10,0.1),0_32px_70px_-20px_rgba(20,16,10,0.65)] ring-1 ring-paper/10 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out-expo sm:bottom-[6.5rem] sm:right-6 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Bronze light falling from the top edge, as on the OBA section. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(169,130,90,0.26),transparent_75%)]"
        />

        <header className="relative flex items-center justify-center border-b border-rule-dark px-12 py-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-paper/[0.06] ring-1 ring-inset ring-bronze/40">
              <Mark size={16} />
            </span>
            <div className="text-center leading-tight">
              <p className="text-[13px] font-semibold tracking-[0.14em]">WOBA</p>
              <p className="text-[12px] text-stone">Horquva assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-stone transition-colors hover:text-paper"
            aria-label="Close chat"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4" aria-live="polite">
          <ol className="space-y-4 py-4">
            {messages.map((m, i) =>
              m.role === "woba" ? (
                <li key={m.id} className="relative pl-3.5 pr-4">
                  {/* The track, as in the product tour; bronze on Woba's latest word. */}
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-[2px] ${i === lastWoba ? "bg-bronze" : "bg-rule-dark"}`}
                  />
                  <p className="font-display text-[16px] font-light leading-[1.45] text-paper">{m.text}</p>
                </li>
              ) : (
                <li key={m.id} className="flex justify-end pl-8">
                  <p className="rounded-[0.75rem] rounded-br-[0.25rem] bg-paper/[0.07] px-3.5 py-2 text-[14px] leading-[1.5] text-paper ring-1 ring-inset ring-paper/10">
                    {m.text}
                  </p>
                </li>
              ),
            )}
          </ol>

          {showSuggestions && (
            <ul className="border-t border-rule-dark" aria-label="Suggested questions">
              {suggestions.map((s) => (
                <li key={s} className="border-b border-rule-dark">
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="group flex w-full items-center justify-between gap-3 py-2.5 text-left text-[14px] text-paper/80 transition-colors hover:text-paper"
                  >
                    {s}
                    <ArrowIcon className="size-3.5 shrink-0 text-bronze transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={onSubmit} className="px-3 pb-2.5 pt-2">
          <div className="flex items-end gap-1.5 rounded-[0.75rem] bg-paper/[0.05] p-1 pl-3.5 ring-1 ring-inset ring-paper/15 transition-shadow focus-within:ring-bronze/70">
            <label htmlFor="woba-input" className="sr-only">
              Message Woba
            </label>
            <textarea
              id="woba-input"
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder="Ask Woba…"
              className="field-sizing-content max-h-24 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-[1.5] text-paper placeholder:text-stone focus:outline-none focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="grid size-9 shrink-0 place-items-center rounded-[0.5rem] bg-paper text-ink transition-colors duration-200 hover:bg-bronze disabled:bg-paper/10 disabled:text-stone"
            >
              <ArrowIcon className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-stone/80">Woba can make mistakes. Check anything important with the team.</p>
        </form>
      </section>

      {/* Launcher: the mark on ink, with light travelling round its bronze edge. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="woba-panel"
        aria-label={open ? "Close chat with Woba" : "Chat with Woba"}
        className="group fixed bottom-5 right-5 z-[46] grid size-14 place-items-center rounded-full bg-ink shadow-[0_18px_40px_-14px_rgba(21,18,15,0.7)] transition-transform duration-500 ease-out-expo hover:scale-[1.06] active:scale-95 sm:bottom-6 sm:right-6"
      >
        {/* The rotating bronze edge: a conic sweep masked to a ring. */}
        <span aria-hidden className="woba-ring absolute inset-0 rounded-full" />
        <span
          aria-hidden
          className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_50%_35%,#2a221c,#15120f_70%)]"
        />
        <span
          className={`relative transition-[transform,opacity] duration-300 ease-out-expo ${
            open ? "scale-50 opacity-0" : "group-hover:-rotate-6"
          }`}
        >
          <Mark size={26} />
        </span>
        <CloseIcon
          className={`absolute size-5 text-paper transition-[transform,opacity] duration-300 ease-out-expo ${
            open ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </button>
    </>
  );
}
