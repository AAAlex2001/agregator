import { request } from "@/shared/api/request";
import type { ChatDetailData } from "../model/types";

/** Открывает чат по заказу; заказчик указывает исполнителя, исполнитель — нет. */
export async function openOrderChat(
  orderId: number,
  expertId: number | null,
): Promise<ChatDetailData> {
  const response = await request("/chats/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: orderId,
      expert_id: expertId,
    }),
    errorMessage: "Не удалось открыть чат",
  });

  return response.json();
}
