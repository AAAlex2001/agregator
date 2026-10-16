"use client";

import { useReducer } from "react";
import type { FormEvent } from "react";
import { LEAD_DIRECTIONS, submitLead } from "@/entities/lead";
import { useNotifications } from "@/shared/ui/notifications";
import { createLeadFormState, leadFormReducer } from "./reducer";
import type { LeadTextField } from "./types";

/** Управляет черновиком заявки, направлением работ и отправкой данных посетителя. */
export function useLeadForm(defaultDirection?: string) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(
    leadFormReducer,
    defaultDirection ?? LEAD_DIRECTIONS[0].value,
    createLeadFormState,
  );
  const direction = LEAD_DIRECTIONS.find(
    (item) => item.value === state.fields.direction,
  ) ?? LEAD_DIRECTIONS[0];

  /** Обновляет одно текстовое поле заявки. */
  function changeField(field: LeadTextField, value: string) {
    dispatch({
      type: "field/changed",
      field,
      value,
    });
  }

  /** Меняет направление и очищает виды работ от предыдущего направления. */
  function changeDirection(value: string) {
    dispatch({
      type: "direction/changed",
      direction: value,
    });
  }

  /** Сохраняет выбранные виды работ в черновике. */
  function changeKinds(workKinds: string[]) {
    dispatch({
      type: "kinds/changed",
      workKinds,
    });
  }

  /** Отправляет заявку с адресом текущей страницы и показывает результат. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.isSending || state.isSent) {
      return;
    }

    const { fields } = state;

    dispatch({
      type: "submit/started",
    });

    try {
      await submitLead({
        direction: fields.direction,
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        company: fields.company,
        inn: fields.inn,
        region: fields.region,
        work_kinds: fields.workKinds.join(", "),
        object_name: fields.objectName,
        task: fields.task,
        deadline: fields.deadline,
        budget: fields.budget,
        source_url: window.location.href,
      });

      dispatch({
        type: "submit/succeeded",
      });
    } catch (error) {
      dispatch({
        type: "submit/failed",
      });
      showError(
        error instanceof Error ? error.message : "Не удалось отправить заявку",
      );
    }
  }

  return {
    state,
    direction,
    changeField,
    changeDirection,
    changeKinds,
    submit,
  };
}
