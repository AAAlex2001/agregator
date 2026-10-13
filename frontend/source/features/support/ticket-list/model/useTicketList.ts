"use client";

import { useEffect, useReducer } from "react";
import { fetchTickets, type Ticket } from "@/source/entities/ticket";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATE, ticketListReducer } from "./reducer";

const PAGE_SIZE = 50;
const LOAD_FAILED = "Не удалось загрузить обращения";

/** Список обращений с подгрузкой. Открытое обращение помечается прочитанным, новое или с ответом — обновляется в списке. */
export function useTicketList() {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(ticketListReducer, INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    fetchTickets(0, PAGE_SIZE)
      .then((data) => {
        if (!cancelled) dispatch({ type: "load/success", tickets: data.items, hasMore: data.has_more });
      })
      .catch((error) => {
        if (cancelled) return;
        dispatch({ type: "load/error" });
        showError(error instanceof Error ? error.message : LOAD_FAILED);
      });
    return () => {
      cancelled = true;
    };
  }, [showError]);

  const loadMore = async () => {
    if (state.isLoadingMore || !state.hasMore) return;
    dispatch({ type: "more/start" });
    try {
      const data = await fetchTickets(state.tickets.length, PAGE_SIZE);
      dispatch({ type: "more/success", tickets: data.items, hasMore: data.has_more });
    } catch (error) {
      showError(error instanceof Error ? error.message : LOAD_FAILED);
    } finally {
      dispatch({ type: "more/finish" });
    }
  };

  return {
    state,
    loadMore,
    markRead: (id: number) => dispatch({ type: "ticket/read", id }),
    upsert: (ticket: Ticket) => dispatch({ type: "ticket/upsert", ticket }),
  };
}
