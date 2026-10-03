export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface RagSource {
  id: string;
  title: string;
  url: string;
  /** Short preview shown under the answer in the chat panel. */
  snippet: string;
  /** Full retrieved text given to the model. Server-side only, stripped before streaming. */
  content?: string;
  score: number;
}

export interface WobaMessage {
  id: string;
  role: "user" | "woba";
  text: string;
  sources?: RagSource[];
}

export interface StreamEventPayload {
  type: "token" | "sources" | "error" | "done";
  token?: string;
  sources?: RagSource[];
  error?: string;
}
