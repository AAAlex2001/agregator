import { request } from "@/shared/api/request";
import type { BlitzOrderScope, BlitzOrderSummary } from "../model/types";

/** Заявки заказчика, входящие эксперту или взятые им в работу. */
export async function getBlitzOrders(scope: BlitzOrderScope): Promise<BlitzOrderSummary[]> {
  const response = await request(`/blitz/orders/${scope}`, {
    errorMessage: "Не удалось загрузить заявки",
  });

  return response.json();
}
