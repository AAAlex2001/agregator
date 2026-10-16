import type {
  Ticket,
  TicketListAction,
  TicketListState,
  TicketSummary,
} from "./types";

/** Состояние до ответа с первой страницей обращений. */
export const INITIAL_TICKET_LIST_STATE: TicketListState = {
  tickets: [],
  hasMore: false,
  isLoading: true,
  isLoadingMore: false,
  error: null,
};

/** Оставляет у обращения поля списка: переписка в нём не нужна. */
function toTicketSummary(ticket: Ticket): TicketSummary {
  return {
    id: ticket.id,
    number: ticket.number,
    subject: ticket.subject,
    category: ticket.category,
    status: ticket.status,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    has_unread: ticket.has_unread,
    last_message_preview: ticket.last_message_preview,
  };
}

/** Обновляет список обращений по ответам API и действиям в переписке. */
export function ticketListReducer(
  state: TicketListState,
  action: TicketListAction,
): TicketListState {
  switch (action.type) {
    case "load/success":
      return {
        ...state,
        tickets: action.tickets,
        hasMore: action.hasMore,
        isLoading: false,
      };
    case "load/error":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case "more/start":
      return {
        ...state,
        isLoadingMore: true,
      };
    case "more/success":
      return {
        ...state,
        tickets: [...state.tickets, ...action.tickets],
        hasMore: action.hasMore,
        isLoadingMore: false,
      };
    case "more/error":
      return {
        ...state,
        isLoadingMore: false,
      };
    case "ticket/read":
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.id ? { ...ticket, has_unread: false } : ticket,
        ),
      };
    case "ticket/upsert": {
      const summary = toTicketSummary(action.ticket);
      const isListed = state.tickets.some((ticket) => ticket.id === summary.id);

      return {
        ...state,
        tickets: isListed
          ? state.tickets.map((ticket) => (ticket.id === summary.id ? summary : ticket))
          : [summary, ...state.tickets],
      };
    }
  }
}
