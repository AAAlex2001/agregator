import type { Question, QuestionStatus } from "@/entities/question";
import { adminRequest, jsonBody } from "@/shared/api";

type QuestionList = {
  items: Question[];
};

/** Вопросы посетителей, при необходимости — только одного статуса. */
export const fetchQuestions = (status: string) => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  return adminRequest<QuestionList>(`/rtn/questions?${params}`);
};

/** Сменить статус вопроса. При отклонении нужна причина — её увидит автор. */
export const setQuestionStatus = (id: number, status: QuestionStatus, dismissReason = "") =>
  adminRequest<Question>(`/rtn/questions/${id}`, jsonBody("PATCH", { status, dismiss_reason: dismissReason }));

/** Удалить вопрос вместе с ответами сообщества и подписками. */
export const deleteQuestion = (id: number) => adminRequest<void>(`/rtn/questions/${id}`, { method: "DELETE" });
