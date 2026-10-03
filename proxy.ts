import { NextResponse, type NextRequest } from "next/server";
import { GONE_HTML, isRetiredUrl } from "@/lib/legacy-wordpress";

/** Answers every address left over from the old WordPress site with 410 Gone. */
export function proxy(request: NextRequest) {
  if (!isRetiredUrl(request.nextUrl)) return NextResponse.next();
  return new NextResponse(GONE_HTML, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  // The app's own build assets and API never need checking.
  matcher: ["/((?!_next/|api/).*)"],
};
