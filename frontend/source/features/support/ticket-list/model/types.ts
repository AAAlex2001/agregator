import type { Ticket, TicketSummary } from "@/source/entities/ticket";

export interface TicketListState {
  tickets: TicketSummary[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

export type TicketListAction =
  | { type: "load/success"; tickets: TicketSummary[]; hasMore: boolean }
  | { type: "load/error" }
  | { type: "more/start" }
  | { type: "more/success"; tickets: TicketSummary[]; hasMore: boolean }
  | { type: "more/finish" }
  | { type: "ticket/read"; id: number }
  | { type: "ticket/upsert"; ticket: Ticket };
