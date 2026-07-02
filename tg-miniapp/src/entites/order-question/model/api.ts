import { apiJson } from "@/shared/services/api";

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

export interface OrderQuestionList {
  items: OrderQuestion[];
  total: number;
}

export const fetchOrderQuestions = (orderId: number) =>
  apiJson<OrderQuestionList>(`/orders/${orderId}/questions`);

export const askOrderQuestion = (orderId: number, question: string, isAnonymous: boolean) =>
  apiJson<OrderQuestion>(`/orders/${orderId}/questions`, {
    method: "POST",
    body: JSON.stringify({ question, is_anonymous: isAnonymous }),
  });
