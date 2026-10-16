"use client";

import { useEffect, useReducer } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { getTickets } from "../api/get-tickets";
import { INITIAL_TICKET_LIST_STATE, ticketListReducer } from "./ticket-list-reducer";
import type { Ticket } from "./types";

/** Сколько обращений загружать за один запрос. */
const TICKETS_PAGE_SIZE = 50;

/** Список обращений с подгрузкой; открытые и новые обращения обновляются в нём сразу. */
export function useTicketList() {
  const [state, dispatch] = useReducer(ticketListReducer, INITIAL_TICKET_LIST_STATE);
  const { showError } = useNotifications();

  useEffect(() => {
    let isActive = true;

    getTickets(0, TICKETS_PAGE_SIZE)
      .then((page) => {
        if (isActive) {
          dispatch({
            type: "load/success",
            tickets: page.items,
            hasMore: page.has_more,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          dispatch({
            type: "load/error",
            error: error instanceof Error ? error.message : "Не удалось загрузить обращения",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  /** Догружает следующую страницу, когда список прокручен до конца. */
  async function loadMore() {
    if (state.isLoadingMore || !state.hasMore) {
      return;
    }

    dispatch({ type: "more/start" });

    try {
      const page = await getTickets(state.tickets.length, TICKETS_PAGE_SIZE);

      dispatch({
        type: "more/success",
        tickets: page.items,
        hasMore: page.has_more,
      });
    } catch (error) {
      dispatch({ type: "more/error" });
      showError(error instanceof Error ? error.message : "Не удалось загрузить обращения");
    }
  }

  /** Снимает отметку непрочитанного с открытого обращения. */
  function markRead(id: number) {
    dispatch({
      type: "ticket/read",
      id,
    });
  }

  /** Добавляет новое обращение или обновляет его после ответа. */
  function upsertTicket(ticket: Ticket) {
    dispatch({
      type: "ticket/upsert",
      ticket,
    });
  }

  return {
    state,
    loadMore,
    markRead,
    upsertTicket,
  };
}
