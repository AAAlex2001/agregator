import { request } from "@/shared/api/request";
import type { PublicOrder } from "../model/types";

/** Загружает условия заказа по публичному идентификатору. */
export async function getPublicOrder(publicId: string): Promise<PublicOrder> {
  const response = await request(`/orders/public/${publicId}`, {
    errorMessage: "Заказ не найден",
  });

  return response.json();
}
