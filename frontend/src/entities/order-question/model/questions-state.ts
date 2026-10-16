import type { OrderQuestion } from "./types";

/** Вопросы одного заказа и общий запрет параллельной отправки в этой ветке. */
export interface OrderQuestionsState {
  items: OrderQuestion[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

/** Результаты загрузки и отдельные изменения вопроса или ответа. */
export type OrderQuestionsAction =
  | { type: "load/succeeded"; items: OrderQuestion[] }
  | { type: "load/failed"; error: string }
  | { type: "submit/started" }
  | { type: "submit/finished" }
  | { type: "question/added"; question: OrderQuestion }
  | { type: "question/updated"; question: OrderQuestion };

/** Начинает отдельную загрузку вопросов для нового блока заказа. */
export function createOrderQuestionsState(): OrderQuestionsState {
  return {
    items: [],
    isLoading: true,
    error: null,
    isSubmitting: false,
  };
}

/** Применяет подтверждённые сервером вопросы, сохраняя порядок ветки. */
export function orderQuestionsReducer(
  state: OrderQuestionsState,
  action: OrderQuestionsAction,
): OrderQuestionsState {
  switch (action.type) {
    case "load/succeeded":
      return {
        ...state,
        items: action.items,
        isLoading: false,
        error: null,
      };
    case "load/failed":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case "submit/started":
      return {
        ...state,
        isSubmitting: true,
      };
    case "submit/finished":
      return {
        ...state,
        isSubmitting: false,
      };
    case "question/added":
      return {
        ...state,
        items: [...state.items, action.question],
      };
    case "question/updated":
      return {
        ...state,
        items: state.items.map((question) => (
          question.id === action.question.id ? action.question : question
        )),
      };
  }
}
