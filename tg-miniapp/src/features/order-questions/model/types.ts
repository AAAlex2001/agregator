import type { OrderQuestion } from "@/entites/order-question";

export interface QuestionsState {
  items: OrderQuestion[] | null;
  text: string;
  anon: boolean;
  busy: boolean;
}

export type QuestionsAction =
  | { type: "loaded"; items: OrderQuestion[] }
  | { type: "text"; value: string }
  | { type: "anon"; value: boolean }
  | { type: "busy"; value: boolean }
  | { type: "added"; item: OrderQuestion };
