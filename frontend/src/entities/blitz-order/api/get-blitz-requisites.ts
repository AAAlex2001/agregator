import { request } from "@/shared/api/request";
import type { BlitzRequisites } from "../model/types";

/** Реквизиты из последней заявки заказчика. */
export async function getBlitzRequisites(): Promise<BlitzRequisites> {
  const response = await request("/blitz/orders/requisites", {
    errorMessage: "Не удалось загрузить реквизиты",
  });

  return response.json();
}
