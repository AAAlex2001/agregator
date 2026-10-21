import { request } from "@/shared/api/request";
import type { BlitzOrder } from "../model/types";

/** Состав аудиторской группы целиком. */
export async function setBlitzTeam(orderId: number, accountIds: number[]): Promise<BlitzOrder> {
  const response = await request(`/blitz/orders/${orderId}/team`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_ids: accountIds }),
    errorMessage: "Не удалось сохранить группу",
  });

  return response.json();
}