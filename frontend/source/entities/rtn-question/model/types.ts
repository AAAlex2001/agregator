export type RtnQuestionStatus = "NEW" | "PUBLISHED" | "DISMISSED";

export interface RtnQuestion {
  id: number;
  question_text: string;
  status: RtnQuestionStatus;
  answered_clarification_id: number | null;
  created_at: string;
}
