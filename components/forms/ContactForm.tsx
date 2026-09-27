"use client";

import { useSearchParams } from "next/navigation";
import { EnquiryForm } from "./EnquiryForm";

/** The contact page form: preselects ?service= and shows the result of a no-JS post. */
export function ContactForm() {
  const params = useSearchParams();
  const initialStatus = params.get("sent") ? "sent" : params.get("error") ? "failed" : "idle";
  return <EnquiryForm defaultService={params.get("service") ?? undefined} initialStatus={initialStatus} />;
}
