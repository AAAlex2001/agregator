import { formatRub } from "@/shared/lib/format-rub";

/** Цена заявки для людей: заказчик аудита может её не указывать. */
export function blitzPriceLabel(price: number | null): string {
  return price === null ? "Цена по предложению аудитора" : formatRub(price);
}

/** Цена из поля: пробелы между разрядами и запятая допустимы. */
export function parseBlitzPrice(value: string): number {
  return Number(value.replace(/\s/g, "").replace(",", "."));
}
