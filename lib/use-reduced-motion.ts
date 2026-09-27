"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/** True when the visitor asked for less motion. Assumes reduced on the server so nothing animates before hydration decides. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
}
