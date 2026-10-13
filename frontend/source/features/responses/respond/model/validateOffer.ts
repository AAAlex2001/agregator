import type { OrderCardData } from "@/source/entities/order";
import { isValidInn } from "@/source/shared/lib/inn";
import type { OfferState } from "./types";

function day(value: string): number {
  return value ? new Date(`${value}T00:00:00`).getTime() : 0;
}

/** Текст первой найденной ошибки предложения или пустая строка. */
export function validateOffer(order: OrderCardData, offer: OfferState): string {
  if (!offer.startDate) return "Укажите срок начала выполнения работ";
  if (!offer.deadline) return "Укажите срок окончания выполнения работ";
  if (!offer.cost || Number(offer.cost) <= 0) return "Укажите стоимость работ";
  if (order.sumAmountRaw > 0 && Number(offer.cost) * 100 > order.sumAmountRaw) return "Стоимость не может превышать бюджет заказчика";
  if (day(order.startDateRaw) && day(offer.startDate) < day(order.startDateRaw)) {
    return "Срок начала выполнения работ не может быть раньше срока заказчика";
  }
  if (day(order.deadlineRaw) && day(offer.deadline) > day(order.deadlineRaw)) {
    return "Срок окончания выполнения работ не может быть позже срока заказчика";
  }
  if (day(offer.startDate) > day(offer.deadline)) return "Срок начала выполнения работ не может быть позже срока окончания";
  if (order.requiresLicense && !isValidInn(offer.company?.data.inn)) return "Выберите вашу компанию из списка";
  return "";
}
