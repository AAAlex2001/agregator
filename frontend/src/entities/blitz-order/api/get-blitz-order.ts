import { request } from "@/shared/api/request";
import type { BlitzOrder } from "../model/types";

/** Заявка целиком. */
export async function getBlitzOrder(id: number): Promise<BlitzOrder> {
  const response = await request(`/blitz/orders/${id}`, {
    errorMessage: "Не удалось загрузить заявку",
  });

  return response.json();
}
