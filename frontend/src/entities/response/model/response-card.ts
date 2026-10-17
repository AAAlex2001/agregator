import { VAT_OPTIONS } from "../config/vat";
import type { ResponseItem, ResponseViewer, VatKind } from "./types";

/** Возвращает подпись ставки НДС для строки стоимости. */
function getVatLabel(vatKind: VatKind): string {
  return VAT_OPTIONS.find((option) => option.id === vatKind)?.label ?? "";
}

/** Цена исполнителя вместе со ставкой НДС. */
export function getResponseCost(response: ResponseItem): string {
  if (!response.proposed_sum.trim()) {
    return response.proposed_sum;
  }

  return `${response.proposed_sum} · ${getVatLabel(response.vat_kind)}`;
}

/** Заказчик всегда видит комментарий исполнителя, исполнитель — пока идут переговоры. */
export function isResponseCommentVisible(
  response: ResponseItem,
  viewer: ResponseViewer,
): boolean {
  if (viewer === "CUSTOMER") {
    return true;
  }

  if (response.status === "IN_PROGRESS") {
    return !response.expert_confirmed;
  }

  return response.status === "ACCEPTED" || response.status === "REJECTED";
}

/** Исполнитель видит комментарий заказчика, пока заказ обсуждается или завершён. */
export function isOrderCommentVisible(
  response: ResponseItem,
  viewer: ResponseViewer,
): boolean {
  if (viewer === "CUSTOMER") {
    return false;
  }

  if (response.status === "IN_PROGRESS") {
    return !response.expert_confirmed;
  }

  return response.status === "REVIEW"
    || response.status === "ACCEPTED"
    || response.status === "COMPLETED";
}

/** Есть ли действия: заказчику нечего делать с отозванным и уже оценённым откликом. */
export function hasResponseActions(
  response: ResponseItem,
  viewer: ResponseViewer,
): boolean {
  if (viewer === "EXPERT") {
    return true;
  }

  if (response.status === "COMPLETED") {
    return !response.has_review;
  }

  return response.status !== "WITHDRAWN_BY_EXPERT";
}

/** Напоминание исполнителю подтвердить выбор заказчика до установленного срока. */
export function getConfirmReminder(
  response: ResponseItem,
  viewer: ResponseViewer,
): string {
  const isWaitingForExpert = viewer === "EXPERT"
    && response.status === "IN_PROGRESS"
    && !response.expert_confirmed
    && response.confirm_deadline !== "";

  return isWaitingForExpert ? `Подтвердите согласие до ${response.confirm_deadline}` : "";
}
