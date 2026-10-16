import { request } from "@/shared/api/request";

/** Снимает объявление автора с публикации. */
export async function closeLaborListing(listingId: number): Promise<void> {
  await request(`/labor/listings/${listingId}`, {
    method: "DELETE",
    errorMessage: "Не удалось закрыть заявку",
  });
}
