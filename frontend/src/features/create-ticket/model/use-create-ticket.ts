"use client";

import { useReducer } from "react";
import type { FormEvent } from "react";
import { createTicket, useTicketFiles } from "@/entities/ticket";
import type { TicketCategory } from "@/entities/ticket";
import { useNotifications } from "@/shared/ui/notifications";
import { createTicketReducer, INITIAL_CREATE_TICKET_STATE } from "./reducer";
import type { CreateTicketField, CreateTicketOptions } from "./types";

/** Наибольшая длина темы обращения. */
const SUBJECT_MAX_LENGTH = 200;

/** Черновик нового обращения с файлами; созданное обращение отдаётся наружу. */
export function useCreateTicket({ onCreated }: CreateTicketOptions) {
  const [state, dispatch] = useReducer(createTicketReducer, INITIAL_CREATE_TICKET_STATE);
  const attachments = useTicketFiles();
  const { showError } = useNotifications();

  /** Меняет тему или сообщение; тему обрезает до допустимой длины. */
  function changeField(field: CreateTicketField, value: string) {
    dispatch({
      type: "field/change",
      field,
      value: field === "subject" ? value.slice(0, SUBJECT_MAX_LENGTH) : value,
    });
  }

  /** Меняет тему обращения из списка категорий. */
  function changeCategory(category: TicketCategory) {
    dispatch({
      type: "category/change",
      category,
    });
  }

  /** Отправляет обращение; при ошибке оставляет черновик и файлы в форме. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.isSubmitting) {
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      const ticket = await createTicket({
        subject: state.subject.trim(),
        category: state.category,
        message: state.message.trim(),
        files: attachments.files,
      });

      dispatch({ type: "submit/success" });
      onCreated(ticket);
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Не удалось создать обращение");
    }
  }

  return {
    state,
    attachments,
    changeField,
    changeCategory,
    submit,
  };
}
