import { request } from "@/shared/api/request";
import { fromSroProfileResponse, toSroProfilePayload } from "../model/profile-values";
import type {
  SroDirection,
  SroProfile,
  SroProfileResponse,
  SroProfileValues,
} from "../model/types";

/** Сохраняет членство СРО, права на работы и условия оплаты. */
export async function updateSroProfile(
  direction: SroDirection,
  values: SroProfileValues,
): Promise<SroProfile> {
  const response = await request(`/directions/${direction}/license-holder-profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSroProfilePayload(values)),
    errorMessage: "Не удалось сохранить анкету члена СРО",
  });
  const profile: SroProfileResponse = await response.json();

  return fromSroProfileResponse(profile);
}
