import { request } from "@/shared/api/request";

/** Удаляет заказ текущего заказчика вместе с его откликами. */
export async function deleteOrder(orderId: number): Promise<void> {
  await request(`/orders/${orderId}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить заказ",
  });
}
