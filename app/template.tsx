import { ViewTransition, type ReactNode } from "react";

/**
 * Every page is wrapped here (templates remount on each navigation, unlike the layout), so moving
 * between pages fades the old one out and eases the new one in. The header, in the layout, stays
 * put. Browsers without view transitions simply swap pages as before.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
