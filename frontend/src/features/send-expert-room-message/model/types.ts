import type { LocalFile } from "@/shared/lib/local-file";

/** Черновик сообщения всем исполнителям и состояние его отправки. */
export interface SendExpertRoomMessageState {
  text: string;
  files: LocalFile[];
  isSending: boolean;
  progress: number;
}

/** Изменения черновика и этапы отправки сообщения. */
export type SendExpertRoomMessageAction =
  | { type: "text/change"; value: string }
  | { type: "files/add"; files: LocalFile[] }
  | { type: "files/remove"; file: LocalFile }
  | { type: "submit/start" }
  | { type: "submit/progress"; progress: number }
  | { type: "submit/success" }
  | { type: "submit/error" };
