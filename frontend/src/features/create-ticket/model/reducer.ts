import type { CreateTicketAction, CreateTicketState } from "./types";

/** Пустое обращение с темой «Вопрос по заказу». */
export const INITIAL_CREATE_TICKET_STATE: CreateTicketState = {
  subject: "",
  category: "ORDER",
  message: "",
  isSubmitting: false,
};

/** Обновляет черновик обращения и состояние его отправки. */
export function createTicketReducer(
  state: CreateTicketState,
  action: CreateTicketAction,
): CreateTicketState {
  switch (action.type) {
    case "field/change":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "category/change":
      return {
        ...state,
        category: action.category,
      };
    case "submit/start":
      return {
        ...state,
        isSubmitting: true,
      };
    case "submit/success":
    case "submit/error":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
