import type { LocalFile } from "@/shared/lib/local-file";

/** Черновик сообщения в чате и состояние его отправки. */
export interface SendChatMessageState {
  text: string;
  files: LocalFile[];
  clientMessageId: string | null;
  isSending: boolean;
  progress: number;
}

/** Изменения черновика и этапы отправки сообщения. */
export type SendChatMessageAction =
  | { type: "text/change"; value: string }
  | { type: "files/add"; files: LocalFile[] }
  | { type: "files/remove"; file: LocalFile }
  | { type: "submit/start"; clientMessageId: string }
  | { type: "submit/progress"; progress: number }
  | { type: "submit/success" }
  | { type: "submit/error" };
