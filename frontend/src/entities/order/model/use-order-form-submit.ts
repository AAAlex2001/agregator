"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { toStepError, withStep } from "@/shared/lib/step-error";
import { useNotifications } from "@/shared/ui/notifications";
import { useOrderForm, useOrderFormSteps } from "./order-form-provider";
import {
  findOrderFormProblem,
  getOrderStepError,
  getOrderStepTitle,
  ORDER_FORM_FIELD_PLACES,
} from "./order-form-steps";
import type { OrderFormStep } from "./order-form-steps";
import type { OrderFormValues } from "./order-form-types";

/**
 * Отправка формы заказа по шагам: на промежуточных шагах проверяет шаг и открывает следующий,
 * на последнем — проверяет весь заказ и сохраняет. save возвращает текст об успехе.
 */
export function useOrderFormSubmit(
  save: (values: OrderFormValues) => Promise<string>,
  onSaved: () => void,
) {
  const { values } = useOrderForm();
  const steps = useOrderFormSteps();
  const { showError, showSuccess } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  /** Открывает шаг, если он есть в форме для выбранного вида работ. */
  function openStep(step: OrderFormStep) {
    const index = steps.keys.indexOf(step);

    if (index >= 0) {
      steps.open(index);
    }
  }

  /** Проверяет текущий шаг и открывает следующий. */
  function goForward() {
    const message = getOrderStepError(steps.current, values);

    if (message) {
      showError(message);
      return;
    }

    steps.forward();
  }

  /** Сохраняет заказ; при ошибке открывает шаг, где её исправить, и оставляет поля заполненными. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (!steps.isLast) {
      goForward();
      return;
    }

    const problem = findOrderFormProblem(values);

    if (problem) {
      showError(withStep(getOrderStepTitle(problem.step, values), problem.message));
      openStep(problem.step);
      return;
    }

    setIsSaving(true);

    try {
      showSuccess(await save(values));
      onSaved();
    } catch (error) {
      const titleOf = (step: OrderFormStep) => getOrderStepTitle(step, values);
      const located = toStepError(
        error,
        ORDER_FORM_FIELD_PLACES,
        titleOf,
        "Не удалось сохранить заказ",
      );

      showError(located.message);

      if (located.step) {
        openStep(located.step);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return { isSaving, submit };
}