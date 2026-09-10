export type RtnQuestionStatus = "NEW" | "IN_REVIEW" | "PUBLISHED" | "DISMISSED";

export interface RtnQuestion {
  id: number;
  question_text: string;
  contact_email: string;
  status: RtnQuestionStatus;
  dismiss_reason: string;
  answered_clarification_id: number | null;
  answer_title: string | null;
  answer_slug: string | null;
  created_at: string;
}
