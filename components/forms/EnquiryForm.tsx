"use client";

import { useId, useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type Enquiry } from "@/lib/enquiry-schema";
import { budgetOptions, enquiryServiceOptions, site } from "@/content/site";
import { Button } from "@/components/ui/Button";

type Tone = "paper" | "ink";
type Status = "idle" | "sent" | "limited" | "failed";

type Props = {
  tone?: Tone;
  defaultService?: string;
  /** Result of a no-JS form post, read from the URL by the contact page. */
  initialStatus?: Status;
};

export function EnquiryForm({ tone = "paper", defaultService, initialStatus = "idle" }: Props) {
  const uid = useId();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [sentName, setSentName] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      service: defaultService && enquiryServiceOptions.includes(defaultService) ? defaultService : "",
      budget: "",
      website: "",
    },
  });

  const muted = tone === "ink" ? "text-paper/60" : "text-ink-soft";
  // On ink the lines need a little more contrast, and the browser's own dropdown lists are asked to draw
  // dark (color-scheme) with the site's ink behind the options.
  const line =
    tone === "ink"
      ? "border-paper/15 bg-paper/[0.03] hover:border-paper/30 focus:border-bronze [color-scheme:dark] [&>option]:bg-ink [&>option]:text-paper"
      : "border-rule bg-white/50 hover:border-stone focus:border-bronze-deep";
  const errorText = tone === "ink" ? "text-bronze" : "text-bronze-deep";

  async function onSubmit(values: Enquiry) {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null);

    if (!res) return setStatus("failed");
    if (res.ok) {
      setSentName(values.name.split(" ")[0]);
      return setStatus("sent");
    }
    if (res.status === 400) {
      const body = (await res.json().catch(() => ({}))) as { errors?: Record<string, string[]> };
      for (const [field, messages] of Object.entries(body.errors ?? {})) {
        setError(field as keyof Enquiry, { message: messages[0] });
      }
      return;
    }
    setStatus(res.status === 429 ? "limited" : "failed");
  }

  if (status === "sent") {
    return (
      <div role="status" className="max-w-2xl py-6">
        <p className="text-heading">{sentName ? `Thanks, ${sentName}.` : "Thanks."} We have your message.</p>
        <p className={`mt-4 ${muted}`}>We&apos;ll reply within two working days, usually sooner.</p>
      </div>
    );
  }

  const field = (name: keyof Enquiry) => ({
    id: `${uid}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const input = `w-full rounded-xl border px-4 py-3 text-[17px] outline-none transition-colors placeholder:text-stone/70 ${line}`;
  // Dropdowns draw their own chevron, since appearance-none removes the browser's.
  const select = `${input} appearance-none pr-11`;

  return (
    <form
      action="/api/enquiry"
      method="post"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-x-10 gap-y-8 md:grid-cols-2"
    >
      <Field label="Name" htmlFor={`${uid}-name`} error={errors.name} errorId={`${uid}-name-error`} errorText={errorText}>
        <input {...register("name")} {...field("name")} autoComplete="name" className={input} />
      </Field>

      <Field label="Email" htmlFor={`${uid}-email`} error={errors.email} errorId={`${uid}-email-error`} errorText={errorText}>
        <input {...register("email")} {...field("email")} type="email" autoComplete="email" className={input} />
      </Field>

      <Field
        label="Company"
        hint="Optional"
        htmlFor={`${uid}-company`}
        error={errors.company}
        errorId={`${uid}-company-error`}
        errorText={errorText}
        hintClass={muted}
      >
        <input {...register("company")} {...field("company")} autoComplete="organization" className={input} />
      </Field>

      <Field label="What do you need?" htmlFor={`${uid}-service`} error={errors.service} errorId={`${uid}-service-error`} errorText={errorText}>
        <Chevron>
          <select {...register("service")} {...field("service")} className={select}>
            <option value="" disabled>
              Choose a service
            </option>
            {enquiryServiceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Chevron>
      </Field>

      <Field label="Budget" htmlFor={`${uid}-budget`} error={errors.budget} errorId={`${uid}-budget-error`} errorText={errorText}>
        <Chevron>
          <select {...register("budget")} {...field("budget")} className={select}>
            <option value="" disabled>
              Choose a range
            </option>
            {budgetOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Chevron>
      </Field>

      <div className="md:col-span-2">
        <Field
          label="About the project"
          htmlFor={`${uid}-message`}
          error={errors.message}
          errorId={`${uid}-message-error`}
          errorText={errorText}
        >
          <textarea
            {...register("message")}
            {...field("message")}
            rows={5}
            placeholder="What you're trying to do, where it runs today, and any deadline."
            className={`${input} resize-y`}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input {...register("website")} id={`${uid}-website`} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-2">
        <Button type="submit" tone={tone} disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </Button>
        {status === "limited" && (
          <p role="alert" className={errorText}>
            Too many attempts. Try again in a few minutes.
          </p>
        )}
        {status === "failed" && (
          <p role="alert" className={errorText}>
            Couldn&apos;t send your message. Email us directly at{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  errorId,
  errorText,
  hintClass = "",
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: FieldError;
  errorId: string;
  errorText: string;
  hintClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex justify-between text-[15px]">
        <span>{label}</span>
        {hint && <span className={hintClass}>{hint}</span>}
      </label>
      {children}
      {error?.message && (
        <p id={errorId} className={`mt-2 text-[14px] ${errorText}`}>
          {error.message}
        </p>
      )}
    </div>
  );
}

/** Wraps a select with a chevron, drawn in the text colour. */
function Chevron({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
