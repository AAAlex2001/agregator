import type { Ticket, TicketSummary } from "@/source/entities/ticket";
import type { TicketListAction, TicketListState } from "./types";

export const INITIAL_STATE: TicketListState = { tickets: [], hasMore: false, isLoading: true, isLoadingMore: false };

/** Обращение без переписки — в списке она не нужна. */
function toSummary(ticket: Ticket): TicketSummary {
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

export function ticketListReducer(state: TicketListState, action: TicketListAction): TicketListState {
  switch (action.type) {
    case "load/success":
      return { ...state, tickets: action.tickets, hasMore: action.hasMore, isLoading: false };
    case "load/error":
      return { ...state, isLoading: false };
    case "more/start":
      return { ...state, isLoadingMore: true };
    case "more/success":
      return { ...state, tickets: [...state.tickets, ...action.tickets], hasMore: action.hasMore };
    case "more/finish":
      return { ...state, isLoadingMore: false };
    case "ticket/read":
      return {
        ...state,
        tickets: state.tickets.map((item) => (item.id === action.id ? { ...item, has_unread: false } : item)),
      };
    case "ticket/upsert": {
      const summary = toSummary(action.ticket);
      const exists = state.tickets.some((item) => item.id === summary.id);
      return {
        ...state,
        tickets: exists ? state.tickets.map((item) => (item.id === summary.id ? summary : item)) : [summary, ...state.tickets],
      };
    }
  }
}
