"use client";

import { useEffect, useState } from "react";
import { getTicket } from "../api/get-ticket";
import type { Ticket } from "./types";

/** Переписка последнего завершённого запроса и обращение, для которого она загружена. */
interface TicketState {
  ticketId: number | null;
  ticket: Ticket | null;
  error: string | null;
}

/** Загружает обращение с перепиской и принимает его новую версию после ответа. */
export function useTicket(ticketId: number) {
  const [state, setState] = useState<TicketState>({
    ticketId: null,
    ticket: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getTicket(ticketId)
      .then((ticket) => {
        if (isActive) {
          setState({ ticketId, ticket, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            ticketId,
            ticket: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить обращение",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [ticketId]);

  /** Показывает обращение, которое вернул сервер после ответа пользователя. */
  function applyTicket(ticket: Ticket) {
    setState({ ticketId: ticket.id, ticket, error: null });
  }

  const isLoading = state.ticketId !== ticketId;

  return {
    ticket: isLoading ? null : state.ticket,
    error: isLoading ? null : state.error,
    isLoading,
    applyTicket,
  };
}
