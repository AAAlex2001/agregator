"use client";

import { useReducer, type FormEvent } from "react";
import { LEAD_DIRECTIONS, submitLead } from "@/source/entities/lead";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { initialLeadForm, leadFormReducer } from "./reducer";
import type { LeadTextField } from "./types";

/** Заявка со страницы статьи: поля, выбранное направление с его подсказками и отправка. */
export function useLeadForm(defaultDirection: string | undefined) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(leadFormReducer, defaultDirection ?? LEAD_DIRECTIONS[0].value, initialLeadForm);
  const direction = LEAD_DIRECTIONS.find((item) => item.value === state.fields.direction) ?? LEAD_DIRECTIONS[0];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const { fields } = state;
    dispatch({ type: "submit/start" });
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
      dispatch({ type: "submit/success" });
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Не удалось отправить заявку");
    }
  };

  return {
    state,
    direction,
    changeField: (field: LeadTextField, value: string) => dispatch({ type: "field/change", field, value }),
    changeDirection: (value: string) => dispatch({ type: "direction/change", direction: value }),
    changeKinds: (workKinds: string[]) => dispatch({ type: "kinds/change", workKinds }),
    submit,
  };
}
