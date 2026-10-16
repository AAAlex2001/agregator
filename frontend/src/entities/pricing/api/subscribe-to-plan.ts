import { request } from "@/shared/api/request";
import type { SubscribeResponse } from "../model/types";

/** Создаёт подписку и получает адрес оплаты с возвратом в приложение. */
export async function subscribeToPlan(
  planId: number,
  returnUrl: string,
): Promise<SubscribeResponse> {
  const response = await request("/pricing/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      return_url: returnUrl,
    }),
    errorMessage: "Не удалось оформить подписку",
  });

  return response.json();
}
