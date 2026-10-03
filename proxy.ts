import { NextResponse, type NextRequest } from "next/server";
import { GONE_HTML, isLegacyWordPressUrl } from "@/lib/legacy-wordpress";

/** Answers addresses left over from the old WordPress site with 410 Gone. */
export function proxy(request: NextRequest) {
  if (!isLegacyWordPressUrl(request.nextUrl)) return NextResponse.next();
  return new NextResponse(GONE_HTML, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  // Skip the app's own assets and API; everything else is checked.
  matcher: ["/((?!_next/|api/|photos/|favicon.ico|icon.png|apple-icon.png|logo-mark.png).*)"],
};
