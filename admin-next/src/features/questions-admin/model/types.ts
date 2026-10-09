import type { Question } from "@/entities/question";

export type QuestionsState = {
  filter: string;
  items: Question[] | null;
  loading: boolean;
  failed: boolean;
  pendingId: number | null;
  dismissing: Question | null;
  dismissReason: string;
  removing: Question | null;
};

export type QuestionsAction =
  | { type: "load/start"; filter: string }
  | { type: "load/success"; items: Question[] }
  | { type: "load/error" }
  | { type: "request/start"; id: number }
  | { type: "request/finish" }
  | { type: "question/changed"; question: Question }
  | { type: "question/removed"; id: number }
  | { type: "dismiss/open"; question: Question }
  | { type: "dismiss/change"; value: string }
  | { type: "dismiss/close" }
  | { type: "remove/ask"; question: Question }
  | { type: "remove/cancel" };
