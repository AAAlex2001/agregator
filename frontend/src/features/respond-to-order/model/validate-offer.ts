import { isValidInn } from "@/entities/company";
import type { OrderListItem } from "@/entities/order";
import type { OfferFields } from "./types";

/** Приводит дату календаря к началу дня для сравнения сроков. */
function dayTimestamp(value: string): number {
  return value ? new Date(`${value}T00:00:00`).getTime() : 0;
}

/** Читает срок заказа из формата ДД.ММ.ГГГГ, который возвращает API списка. */
function orderDayTimestamp(value: string): number {
  const [day, month, year] = value.split(".");
  const date = year ? `${year}-${month}-${day}` : value;

  return dayTimestamp(date);
}

/** Возвращает первую ошибку предложения, сверяя сроки, бюджет и реквизиты. */
export function validateOffer(order: OrderListItem, offer: OfferFields): string {
  if (!offer.startDate) {
    return "Укажите срок начала выполнения работ";
  }

  if (!offer.deadline) {
    return "Укажите срок окончания выполнения работ";
  }

  if (!offer.cost || Number(offer.cost) <= 0) {
    return "Укажите стоимость работ";
  }

  const costInKopecks = Number(offer.cost) * 100;

  if (order.sum_amount_raw > 0 && costInKopecks > order.sum_amount_raw) {
    return "Стоимость не может превышать бюджет заказчика";
  }

  const orderStart = orderDayTimestamp(order.start_date);
  const orderDeadline = orderDayTimestamp(order.date);
  const offerStart = dayTimestamp(offer.startDate);
  const offerDeadline = dayTimestamp(offer.deadline);

  if (orderStart && offerStart < orderStart) {
    return "Срок начала выполнения работ не может быть раньше срока заказчика";
  }

  if (orderDeadline && offerDeadline > orderDeadline) {
    return "Срок окончания выполнения работ не может быть позже срока заказчика";
  }

  if (offerStart > offerDeadline) {
    return "Срок начала выполнения работ не может быть позже срока окончания";
  }

  if (order.requires_license && !isValidInn(offer.company?.data.inn)) {
    return "Выберите вашу компанию из списка";
  }

  return "";
}
