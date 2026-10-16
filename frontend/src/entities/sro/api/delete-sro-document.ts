import { request } from "@/shared/api/request";
import { fromSroProfileResponse } from "../model/profile-values";
import type { SroDirection, SroProfile, SroProfileResponse } from "../model/types";

/** Удаляет дополнительный документ члена СРО по его адресу. */
export async function deleteSroDocument(
  direction: SroDirection,
  url: string,
): Promise<SroProfile> {
  const response = await request(
    `/directions/${direction}/license-holder-profile/documents`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      errorMessage: "Не удалось удалить документ",
    },
  );
  const profile: SroProfileResponse = await response.json();

  return fromSroProfileResponse(profile);
}
