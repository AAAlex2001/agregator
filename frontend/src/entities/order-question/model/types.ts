/** Вопрос исполнителя, его видимость и ответ заказчика из API. */
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

/** Доступные текущему пользователю вопросы одного заказа. */
export interface OrderQuestionList {
  items: OrderQuestion[];
  total: number;
}
