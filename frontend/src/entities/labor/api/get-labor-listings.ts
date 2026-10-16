import { request } from "@/shared/api/request";
import type { LaborListing, LaborListingKind } from "../model/types";

/** Ответ API со списком объявлений. */
interface LaborListingsResponse {
  items: LaborListing[];
}

/** Загружает чужие или свои активные объявления выбранного вида. */
export async function getLaborListings(
  kind: LaborListingKind,
  mine: boolean,
): Promise<LaborListing[]> {
  const params = new URLSearchParams({
    kind,
    mine: String(mine),
  });
  const response = await request(`/labor/listings?${params}`, {
    errorMessage: "Не удалось загрузить заявки",
  });
  const data: LaborListingsResponse = await response.json();

  return data.items;
}
