import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";

export interface QuestionApiItem {
  id: number;
  order_id: number;
  expert_id: number;
  expert_name: string;
  expert_avatar_url: string | null;
  question: string;
  answer: string | null;
  asked_at: string;
  answered_at: string | null;
  is_anonymous: boolean;
}

export interface QuestionsApiList {
  items: QuestionApiItem[];
  total: number;
}

export async function fetchQuestions(orderId: number): Promise<QuestionsApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/${orderId}/questions`);
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить вопросы"));
  return res.json();
}

export async function askQuestion(
  orderId: number,
  question: string,
  isAnonymous: boolean,
): Promise<QuestionApiItem> {
  const res = await fetchWithSession(`${API_URL}/orders/${orderId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, is_anonymous: isAnonymous }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось отправить вопрос"));
  return res.json();
}

export async function updateQuestion(
  questionId: number,
  question: string,
  isAnonymous?: boolean,
): Promise<QuestionApiItem> {
  const res = await fetchWithSession(`${API_URL}/questions/${questionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      isAnonymous === undefined
        ? { question }
        : { question, is_anonymous: isAnonymous },
    ),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось обновить вопрос"));
  return res.json();
}

export async function answerQuestion(questionId: number, answer: string): Promise<QuestionApiItem> {
  const res = await fetchWithSession(`${API_URL}/questions/${questionId}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось отправить ответ"));
  return res.json();
}
