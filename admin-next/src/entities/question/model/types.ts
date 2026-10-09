import type { BadgeTone } from "@/shared/ui/badge";

export type QuestionStatus = "NEW" | "IN_REVIEW" | "PUBLISHED" | "DISMISSED";

export type Question = {
  id: number;
  question_text: string;
  contact_email: string;
  status: QuestionStatus;
  dismiss_reason: string;
  answered_clarification_id: number | null;
  answer_slug: string | null;
  answer_title: string | null;
  created_at: string;
};

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  NEW: "Новый",
  IN_REVIEW: "В работе",
  PUBLISHED: "Обработан",
  DISMISSED: "Отклонён",
};

export const QUESTION_STATUS_TONES: Record<QuestionStatus, BadgeTone> = {
  NEW: "info",
  IN_REVIEW: "warning",
  PUBLISHED: "success",
  DISMISSED: "neutral",
};
