import { RtnQuestion, RtnQuestionStatus } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const toQuestion = (raw: any): RtnQuestion => ({
  id: raw.id,
  questionText: raw.question_text,
  contactEmail: raw.contact_email,
  status: raw.status,
  dismissReason: raw.dismiss_reason ?? "",
  answeredClarificationId: raw.answered_clarification_id,
  answerTitle: raw.answer_title ?? null,
  answerSlug: raw.answer_slug ?? null,
  createdAt: raw.created_at,
});

export const getQuestion = async (id: number): Promise<RtnQuestion> => {
  const response = await fetch(`${base}/api/rtn/questions/${id}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить вопрос");
  return toQuestion(await response.json());
};

export const listQuestions = async (status?: RtnQuestionStatus): Promise<RtnQuestion[]> => {
  const qs = status ? `?status=${status}` : "";
  const response = await fetch(`${base}/api/rtn/questions${qs}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить вопросы");
  const data = await response.json();
  return data.items.map(toQuestion);
};

export const deleteQuestion = async (id: number): Promise<void> => {
  const response = await fetch(`${base}/api/rtn/questions/${id}`, { method: "DELETE" });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось удалить вопрос");
};

export const setQuestionStatus = async (
  id: number,
  status: RtnQuestionStatus,
  dismissReason = "",
): Promise<RtnQuestion> => {
  const response = await fetch(`${base}/api/rtn/questions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, dismiss_reason: dismissReason }),
  });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось обновить статус вопроса");
  return toQuestion(await response.json());
};
