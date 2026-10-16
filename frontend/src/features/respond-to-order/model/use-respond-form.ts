"use client";

import { useReducer, useState } from "react";
import type { CompanySuggestion } from "@/entities/company";
import type { OrderListItem } from "@/entities/order";
import { respondToOrder, useResponseFiles } from "@/entities/response";
import type { VatKind } from "@/entities/response";
import { useNotifications } from "@/shared/ui/notifications";
import { INITIAL_OFFER_FIELDS, offerReducer } from "./reducer";
import type { OfferTextField, RespondCallbacks, RespondForm } from "./types";
import { validateOffer } from "./validate-offer";

/** Хранит предложение исполнителя и отправляет проверенные условия заказа. */
export function useRespondForm(
  order: OrderListItem,
  { onResponded, onSubscriptionRequired }: RespondCallbacks,
): RespondForm {
  const [fields, dispatch] = useReducer(offerReducer, INITIAL_OFFER_FIELDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attachments = useResponseFiles();
  const { showError } = useNotifications();

  /** Сохраняет дату или комментарий предложения. */
  function changeField(field: OfferTextField, value: string) {
    dispatch({ type: "field/changed", field, value });
  }

  /** Обновляет стоимость работ в рублях. */
  function changeCost(value: string) {
    dispatch({ type: "cost/changed", value });
  }

  /** Выбирает ставку НДС для предлагаемой стоимости. */
  function changeVatKind(value: VatKind) {
    dispatch({ type: "vat/changed", value });
  }

  /** Сохраняет выбранные реквизиты либо сбрасывает их при ручном вводе. */
  function changeCompany(query: string, company: CompanySuggestion | null) {
    dispatch({
      type: "company/changed",
      name: company?.value ?? query,
      company,
    });
  }

  /** Отправляет условия и вложения; при отказе сохраняет заполненное предложение. */
  async function submit() {
    if (isSubmitting) {
      return;
    }

    const problem = validateOffer(order, fields);

    if (problem) {
      showError(problem);
      return;
    }

    setIsSubmitting(true);

    try {
      await respondToOrder(order.id, {
        comment: fields.comment,
        proposed_sum_amount: Math.round(Number(fields.cost) * 100),
        proposed_start_date: fields.startDate,
        proposed_deadline: fields.deadline,
        vat_kind: fields.vatKind,
        expert_inn: order.requires_license ? fields.company?.data.inn ?? "" : "",
        expert_company_data: order.requires_license ? fields.company : null,
        files: attachments.files,
      });

      onResponded();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Не удалось отправить отклик";

      showError(message);

      if (message.toLowerCase().includes("подписк") || message.includes("402")) {
        onSubscriptionRequired();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fields,
    files: attachments.items,
    isSubmitting,
    changeField,
    changeCost,
    changeVatKind,
    changeCompany,
    addFiles: attachments.addFiles,
    submit,
  };
}
