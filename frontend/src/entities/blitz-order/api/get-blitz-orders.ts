import { request } from "@/shared/api/request";
import type { BlitzOrderScope, BlitzOrderSummary, BlitzService } from "../model/types";

/** Заявки сервиса: заказчика, входящие эксперту или взятые им в работу. */
export async function getBlitzOrders(
  scope: BlitzOrderScope,
  service: BlitzService,
): Promise<BlitzOrderSummary[]> {
  const response = await request(`/blitz/orders/${scope}?service=${service}`, {
    errorMessage: "Не удалось загрузить заявки",
  });

  return response.json();
}