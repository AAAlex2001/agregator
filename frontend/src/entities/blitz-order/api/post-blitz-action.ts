import { request } from "@/shared/api/request";
import type { BlitzOrder } from "../model/types";

/** Шаг заявки без файлов: взять, подписать, отменить, «заключение готово», принять работу. */
export async function postBlitzAction(
  orderId: number,
  action: string,
  body: object,
  errorMessage: string,
): Promise<BlitzOrder> {
  const response = await request(`/blitz/orders/${orderId}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    errorMessage,
  });

  return response.json();
}
