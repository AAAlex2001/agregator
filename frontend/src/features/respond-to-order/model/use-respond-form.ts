"use client";

import { useReducer, useState } from "react";
import type { FormEvent } from "react";
import { isValidInn } from "@/entities/company";
import type { CompanySuggestion } from "@/entities/company";
import type { OrderListItem } from "@/entities/order";
import {
  EMPTY_RESPONSE_OFFER,
  getResponseTermsError,
  respondToOrder,
  responseOfferReducer,
  toResponseOfferRequest,
  useResponseFiles,
} from "@/entities/response";
import { toStepError, withStep } from "@/shared/lib/step-error";
import { useSteps } from "@/shared/lib/use-steps";
import { useNotifications } from "@/shared/ui/notifications";
import { RESPOND_FIELD_PLACES } from "../config/fields";
import { getRespondSteps, RESPOND_STEP_TITLES } from "../config/steps";
import type { RespondStep } from "../config/steps";
import type { CompanyChoice, RespondCallbacks } from "./types";

/** Пустой выбор организации. */
const NO_COMPANY: CompanyChoice = { name: "", company: null };

/** Отказ из-за подписки: отклик списывается с тарифа. */
function isSubscriptionError(message: string): boolean {
  return message.toLowerCase().includes("подписк") || message.includes("402");
}

/** Отклик по шагам: у каждого шага своё состояние и своя проверка, отправка — на последнем. */
export function useRespondForm(
  order: OrderListItem,
  { onResponded, onSubscriptionRequired }: RespondCallbacks,
) {
  const [offer, dispatch] = useReducer(responseOfferReducer, EMPTY_RESPONSE_OFFER);
  const [choice, setChoice] = useState<CompanyChoice>(NO_COMPANY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attachments = useResponseFiles();
  const keys = getRespondSteps(order);
  const steps = useSteps(keys.length, "dialog");
  const { showError } = useNotifications();
  const bounds = {
    startDate: order.start_date,
    deadline: order.date,
    budget: order.sum_amount_raw,
  };

  /** Что не так на шаге, или пустая строка. */
  function stepError(step: RespondStep): string {
    switch (step) {
      case "terms":
        return getResponseTermsError(offer, bounds);
      case "company":
        return isValidInn(choice.company?.data.inn) ? "" : "Выберите вашу компанию из списка";
      case "conditions":
      case "comment":
        return "";
    }
  }

  /** Сохраняет выбранные реквизиты либо сбрасывает их при ручном вводе. */
  function changeCompany(query: string, company: CompanySuggestion | null) {
    setChoice({ name: company?.value ?? query, company });
  }

  /** Отправляет отклик; при отказе сохраняет черновик и при нехватке подписки ведёт к тарифам. */
  async function send() {
    setIsSubmitting(true);

    try {
      await respondToOrder(order.id, {
        ...toResponseOfferRequest(offer),
        expert_inn: order.requires_license ? choice.company?.data.inn ?? "" : "",
        expert_company_data: order.requires_license ? choice.company : null,
        files: attachments.files,
      });
      onResponded();
    } catch (error) {
      const titleOf = (step: RespondStep) => RESPOND_STEP_TITLES[step];
      const located = toStepError(
        error,
        RESPOND_FIELD_PLACES,
        titleOf,
        "Не удалось отправить отклик",
      );

      showError(located.message);

      if (located.step && keys.includes(located.step)) {
        steps.open(keys.indexOf(located.step));
      }

      if (isSubscriptionError(located.message)) {
        onSubscriptionRequired();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Промежуточный шаг проверяет и открывает следующий; последний проверяет всё и отправляет. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const checked = steps.isLast ? keys : [keys[steps.step]];
    const failed = checked.find((step) => stepError(step) !== "");

    if (failed) {
      const message = stepError(failed);

      showError(steps.isLast ? withStep(RESPOND_STEP_TITLES[failed], message) : message);
      steps.open(keys.indexOf(failed));
      return;
    }

    if (steps.isLast) {
      await send();
      return;
    }

    steps.forward();
  }

  return {
    offer,
    dispatch,
    choice,
    changeCompany,
    files: attachments.items,
    addFiles: attachments.addFiles,
    keys,
    steps,
    isSubmitting,
    submit,
  };
}