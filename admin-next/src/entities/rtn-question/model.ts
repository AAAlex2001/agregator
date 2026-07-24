export type RtnQuestionStatus = "NEW" | "PUBLISHED" | "DISMISSED";

export type RtnQuestion = {
  id: number;
  questionText: string;
  contactEmail: string;
  status: RtnQuestionStatus;
  answeredClarificationId: number | null;
  createdAt: string;
};
