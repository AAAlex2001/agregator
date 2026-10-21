import { request } from "@/shared/api/request";
import type { BlitzInvoice } from "../model/types";

/** Счёт на текущий этап оплаты. */
export async function issueBlitzInvoice(orderId: number): Promise<BlitzInvoice> {
  const response = await request(`/blitz/orders/${orderId}/invoice`, {
    method: "POST",
    errorMessage: "Не удалось выставить счёт",
  });

  return response.json();
}
