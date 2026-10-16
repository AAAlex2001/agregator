import { request } from "@/shared/api/request";
import type { LaborListing, LaborListingRequest } from "../model/types";

/** Публикует объявление; повтор с тем же requestId не создаёт дубль. */
export async function createLaborListing(
  payload: LaborListingRequest,
  requestId: string,
): Promise<LaborListing> {
  const response = await request("/labor/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      client_request_id: requestId,
    }),
    errorMessage: "Не удалось создать заявку",
  });

  return response.json();
}
