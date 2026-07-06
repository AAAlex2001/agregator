import type { ChatDetail, ChatMessage } from "@/entites/chat";

export interface ChatThreadState {
  detail: ChatDetail | null;
  text: string;
  files: File[];
  sending: boolean;
}

export type ChatThreadAction =
  | { type: "loaded"; detail: ChatDetail }
  | { type: "text"; value: string }
  | { type: "addFiles"; files: File[] }
  | { type: "removeFile"; index: number }
  | { type: "sending"; value: boolean }
  | { type: "sent"; message: ChatMessage }
  | { type: "reset" };
