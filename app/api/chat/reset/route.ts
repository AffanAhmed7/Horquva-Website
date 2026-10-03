import { cookies } from "next/headers";
import { resetSessionHistory, sessionCookie, SESSION_COOKIE_NAME } from "@/lib/rag/session";

export const runtime = "nodejs";


export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
      await resetSessionHistory(sessionId);
    }

    const newSessionId = crypto.randomUUID();

    return new Response(JSON.stringify({ success: true, sessionId: newSessionId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": sessionCookie(newSessionId),
      },
    });
  } catch (error) {
    console.error("Session reset error:", error);
    return new Response(JSON.stringify({ error: "Failed to reset session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
