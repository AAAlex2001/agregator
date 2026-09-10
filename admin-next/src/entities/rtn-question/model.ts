export type RtnQuestionStatus = "NEW" | "IN_REVIEW" | "PUBLISHED" | "DISMISSED";

export type RtnQuestion = {
  id: number;
  questionText: string;
  contactEmail: string;
  status: RtnQuestionStatus;
  dismissReason: string;
  answeredClarificationId: number | null;
  answerTitle: string | null;
  answerSlug: string | null;
  createdAt: string;
};
