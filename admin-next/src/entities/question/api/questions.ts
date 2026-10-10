import { adminFetch, jsonBody } from "@/shared/api";
import type { Question, QuestionList, QuestionStatus } from "../model/types";

/** Вопросы посетителей, при необходимости — только одного статуса. */
export const fetchQuestions = async (status: string): Promise<QuestionList> => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  const response = await adminFetch(`/rtn/questions?${params}`);

  return response.json();
};

/** Вопрос посетителя — например, чтобы подставить его текст в новое разъяснение. */
export const fetchQuestion = async (id: number): Promise<Question> => {
  const response = await adminFetch(`/rtn/questions/${id}`);

  return response.json();
};

/** Сменить статус вопроса. При отклонении нужна причина — её увидит автор. */
export const setQuestionStatus = async (id: number, status: QuestionStatus, dismissReason = ""): Promise<Question> => {
  const response = await adminFetch(`/rtn/questions/${id}`, jsonBody("PATCH", { status, dismiss_reason: dismissReason }));

  return response.json();
};

/** Удалить вопрос вместе с ответами сообщества и подписками. */
export const deleteQuestion = async (id: number): Promise<void> => {
  await adminFetch(`/rtn/questions/${id}`, { method: "DELETE" });
};
