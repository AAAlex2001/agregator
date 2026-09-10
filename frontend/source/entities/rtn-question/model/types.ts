export type RtnQuestionStatus = "NEW" | "IN_REVIEW" | "PUBLISHED" | "DISMISSED";

export interface RtnQuestionAttachment {
  name: string;
  url: string;
}

export interface PublicRtnQuestion {
  id: number;
  question_text: string;
  status: RtnQuestionStatus;
  answer_title: string | null;
  answer_slug: string | null;
  replies_count: number;
  created_at: string;
}

export interface RtnQuestionReply {
  id: number;
  text: string;
  attachments: RtnQuestionAttachment[];
  author_name: string;
  created_at: string;
}

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
