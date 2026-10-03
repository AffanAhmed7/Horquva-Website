"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { RagSource } from "@/lib/rag/types";

type WobaMessage = {
  id: string;
  role: "user" | "woba";
  text: string;
  sources?: RagSource[];
  streaming?: boolean;
};

const greeting = "Hi, I'm Woba. Ask me about our services, OBA Core, or how a project with Horquva works.";

const suggestions = [
  "What does Horquva build?",
  "Tell me about OBA Core",
  "How does a project start?",
  "How do I get in touch?",
];

let nextId = 0;
const makeId = () => `m${++nextId}`;

class ChatError extends Error {
  constructor(message: string, readonly forVisitor: boolean) {
    super(message);
  }
}

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

function ResetIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12a9 9 0 1015.3-6.36L21 8M21 3v5h-5" />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * Parses markdown links [text](url) and bold text **text** into styled React elements.
 */
function FormattedMessage({ content: raw }: { content: string }) {
  // Models pad line breaks with spaces and stack blank lines; keep at most one blank line.
  const content = raw
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    // Markdown list items ("* " or "- " at a line start) read as bullets, not stray asterisks.
    .replace(/^[ \t]*[*-][ \t]+/gm, "• ");
  // Pattern to match [text](url), **bold** and bare email addresses
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(content.substring(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link [text](url)
      const linkText = match[1];
      const linkUrl = match[2];
      // "//host" is another site, not a path on this one.
      const isInternal = (linkUrl.startsWith("/") && !linkUrl.startsWith("//")) || linkUrl.startsWith("#");
      // Model output decides the URL, so anything but plain web and mail links stays text.
      const isSafeExternal = /^(https?:|mailto:)/i.test(linkUrl);

      if (!isInternal && !isSafeExternal) {
        nodes.push(linkText);
      } else if (isInternal) {
        nodes.push(
          <Link
            key={`link-${match.index}`}
            href={linkUrl}
            className="text-bronze underline decoration-bronze/40 underline-offset-[3px] transition-colors hover:text-paper hover:decoration-paper"
          >
            {linkText}
          </Link>,
        );
      } else {
        nodes.push(
          <a
            key={`ext-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bronze underline decoration-bronze/40 underline-offset-[3px] transition-colors hover:text-paper hover:decoration-paper"
          >
            {linkText}
          </a>,
        );
      }
    } else if (match[4]) {
      // Bare email address: make it a mail link.
      nodes.push(
        <a
          key={`mail-${match.index}`}
          href={`mailto:${match[4]}`}
          className="text-bronze underline decoration-bronze/40 underline-offset-[3px] transition-colors hover:text-paper hover:decoration-paper"
        >
          {match[4]}
        </a>,
      );
    } else if (match[3]) {
      // Bold text **text**
      nodes.push(
        <strong key={`bold-${match.index}`} className="font-medium text-paper">
          {match[3]}
        </strong>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    nodes.push(content.substring(lastIndex));
  }

  return <>{nodes}</>;
}

/**
 * Woba, Horquva's assistant with full RAG retrieval, multi-model fallback cascade,
 * and session context memory.
 */
export function WobaWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WobaMessage[]>([{ id: makeId(), role: "woba", text: greeting }]);
  const [draft, setDraft] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const showSuggestions = messages.length === 1 && !isGenerating;
  const lastWoba = messages.findLastIndex((m) => m.role === "woba");

  function close() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  function toggleSources(messageId: string) {
    setExpandedSources((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  }

  async function resetChat() {
    if (isGenerating) return;
    try {
      await fetch("/api/chat/reset", { method: "POST" });
    } catch (e) {
      console.warn("Could not call reset endpoint:", e);
    }
    setMessages([{ id: makeId(), role: "woba", text: greeting }]);
    setExpandedSources({});
    setDraft("");
    inputRef.current?.focus();
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
  }, [messages, isGenerating]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || isGenerating) return;

    const userMessageId = makeId();
    const assistantMessageId = makeId();

    setMessages((m) => [
      ...m,
      { id: userMessageId, role: "user", text: clean },
      { id: assistantMessageId, role: "woba", text: "", streaming: true },
    ]);
    setDraft("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });

      if (!response.ok || !response.body) {
        // Rate-limit and validation errors carry a message written for the visitor.
        const body = await response.json().catch(() => null);
        throw new ChatError(body?.error ?? `Server returned ${response.status}`, response.status < 500);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let attachedSources: RagSource[] | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === "token" && typeof data.token === "string") {
              const chunkToken = data.token;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, text: msg.text + chunkToken, streaming: true }
                    : msg,
                ),
              );
            } else if (data.type === "sources" && Array.isArray(data.sources)) {
              attachedSources = data.sources;
            } else if (data.type === "error") {
              throw new Error(data.error || "Chat stream error");
            }
          } catch {
            // Non-critical JSON parse error for partial lines
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text: msg.text.trim() || "I didn't receive a response. Please try again.",
                sources: attachedSources,
                streaming: false,
              }
            : msg,
        ),
      );
    } catch (error) {
      console.error("Woba chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text:
                  error instanceof ChatError && error.forVisitor
                    ? error.message
                    : "I couldn't reach the assistant right now. You can check our [Services](/#services) or reach our team directly at [Contact](/contact).",
                streaming: false,
              }
            : msg,
        ),
      );
    } finally {
      setIsGenerating(false);
      inputRef.current?.focus();
    }
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
        className={`fixed bottom-24 right-4 z-[45] flex h-[min(74dvh,540px)] w-[calc(100vw-2rem)] max-w-[370px] origin-bottom-right flex-col overflow-hidden rounded-[1.125rem] bg-ink/95 text-paper shadow-[0_2px_4px_rgba(20,16,10,0.1),0_32px_70px_-20px_rgba(20,16,10,0.65)] ring-1 ring-paper/10 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out-expo sm:bottom-[6.5rem] sm:right-6 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Bronze light falling from the top edge, as on the OBA section. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(169,130,90,0.26),transparent_75%)]"
        />

        <header className="relative flex items-center justify-between border-b border-rule-dark px-4 py-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-paper/[0.06] ring-1 ring-inset ring-bronze/40">
              <Mark size={16} />
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold tracking-[0.14em]">WOBA</p>
                <span className="size-1.5 rounded-full bg-bronze" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetChat}
              disabled={isGenerating || messages.length <= 1}
              className="grid size-8 place-items-center rounded-md text-stone transition-colors hover:text-paper disabled:opacity-30 disabled:hover:text-stone"
              aria-label="Reset chat"
              title="Reset conversation"
            >
              <ResetIcon className="size-[15px]" />
            </button>
            <button
              type="button"
              onClick={close}
              className="grid size-8 place-items-center rounded-md text-stone transition-colors hover:text-paper"
              aria-label="Close chat"
            >
              <CloseIcon className="size-[17px]" />
            </button>
          </div>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4" aria-live="polite">
          <ol className="space-y-4 py-4">
            {messages.map((m, i) =>
              m.role === "woba" ? (
                <li key={m.id} className="relative pl-3.5 pr-3">
                  {/* The track, bronze on Woba's latest word. */}
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-[2px] transition-colors duration-300 ${
                      i === lastWoba ? "bg-bronze" : "bg-rule-dark"
                    }`}
                  />
                  {m.streaming && !m.text ? (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="size-1.5 animate-pulse rounded-full bg-bronze" />
                      <span className="size-1.5 animate-pulse rounded-full bg-bronze [animation-delay:200ms]" />
                      <span className="size-1.5 animate-pulse rounded-full bg-bronze [animation-delay:400ms]" />
                    </div>
                  ) : (
                    <div className="whitespace-pre-line font-display text-[15px] font-light leading-[1.5] text-paper">
                      <FormattedMessage content={m.text} />
                    </div>
                  )}

                  {/* Expandable Sources & Citations Accordion */}
                  {m.sources && m.sources.length > 0 && !m.streaming && (
                    <div className="mt-2.5 border-t border-rule-dark/70 pt-2">
                      <button
                        type="button"
                        onClick={() => toggleSources(m.id)}
                        className="group flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-bronze transition-colors hover:text-paper"
                      >
                        <ChevronIcon
                          className={`size-3 transition-transform duration-200 ${
                            expandedSources[m.id] ? "rotate-90" : ""
                          }`}
                        />
                        <span>Sources consulted ({m.sources.length})</span>
                      </button>

                      {expandedSources[m.id] && (
                        <ul className="mt-2 space-y-1.5 pl-2" aria-label="Referenced sources">
                          {m.sources.map((s) => (
                            <li key={s.id} className="text-[11px] leading-snug">
                              <Link
                                href={s.url}
                                className="block rounded bg-paper/[0.04] p-1.5 text-stone/90 ring-1 ring-inset ring-paper/5 transition-colors hover:bg-paper/[0.08] hover:text-paper"
                              >
                                <span className="font-medium text-paper/90">{s.title}</span>
                                <span className="mt-0.5 block truncate text-[10px] text-stone">
                                  {s.snippet}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
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
              maxLength={1000}
              value={draft}
              disabled={isGenerating}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder={isGenerating ? "Woba is thinking…" : "Ask Woba…"}
              className="field-sizing-content max-h-24 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-[1.5] text-paper placeholder:text-stone focus:outline-none focus-visible:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isGenerating}
              aria-label="Send message"
              className="grid size-9 shrink-0 place-items-center rounded-[0.5rem] bg-paper text-ink transition-colors duration-200 hover:bg-bronze disabled:bg-paper/10 disabled:text-stone"
            >
              <ArrowIcon className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-stone/80">
            Woba can make mistakes. Check anything important with the team.
          </p>
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
