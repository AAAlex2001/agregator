import { request } from "@/shared/api/request";
import { fromSroProfileResponse } from "../model/profile-values";
import type { SroDirection, SroProfile, SroProfileResponse } from "../model/types";

/** Загружает анкету члена СРО по выбранному направлению. */
export async function getSroProfile(direction: SroDirection): Promise<SroProfile> {
  const response = await request(`/directions/${direction}/license-holder-profile`, {
    errorMessage: "Не удалось загрузить анкету члена СРО",
  });
  const profile: SroProfileResponse = await response.json();

  return fromSroProfileResponse(profile);
}
