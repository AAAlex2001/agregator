import { API_URL } from "@/source/shared/api/config";
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
}

export interface QuestionsApiList {
  items: QuestionApiItem[];
  total: number;
}

async function detail(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => ({}));
  throw new Error(typeof body.detail === "string" ? body.detail : fallback);
}

export async function fetchQuestions(orderId: number): Promise<QuestionsApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/${orderId}/questions`);
  if (!res.ok) await detail(res, "Не удалось загрузить вопросы");
  return res.json();
}

export async function askQuestion(orderId: number, question: string): Promise<QuestionApiItem> {
  const res = await fetchWithSession(`${API_URL}/orders/${orderId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) await detail(res, "Не удалось отправить вопрос");
  return res.json();
}

export async function updateQuestion(questionId: number, question: string): Promise<QuestionApiItem> {
  const res = await fetchWithSession(`${API_URL}/questions/${questionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) await detail(res, "Не удалось обновить вопрос");
  return res.json();
}

export async function answerQuestion(questionId: number, answer: string): Promise<QuestionApiItem> {
  const res = await fetchWithSession(`${API_URL}/questions/${questionId}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) await detail(res, "Не удалось отправить ответ");
  return res.json();
}
