import { json, send } from "@/source/shared/api/request";

export interface OrderQuestion {
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

export async function fetchQuestions(orderId: number): Promise<{ items: OrderQuestion[] }> {
  const response = await send(`/orders/${orderId}/questions`, {}, "Не удалось загрузить вопросы");
  return response.json();
}

export async function askQuestion(orderId: number, question: string, isAnonymous: boolean): Promise<OrderQuestion> {
  const response = await send(
    `/orders/${orderId}/questions`,
    json("POST", { question, is_anonymous: isAnonymous }),
    "Не удалось отправить вопрос",
  );
  return response.json();
}

export async function updateQuestion(questionId: number, question: string): Promise<OrderQuestion> {
  const response = await send(`/questions/${questionId}`, json("PATCH", { question }), "Не удалось обновить вопрос");
  return response.json();
}

export async function answerQuestion(questionId: number, answer: string): Promise<OrderQuestion> {
  const response = await send(`/questions/${questionId}/answer`, json("PATCH", { answer }), "Не удалось отправить ответ");
  return response.json();
}
