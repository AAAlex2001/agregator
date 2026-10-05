import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ReferralOverview } from "../model/types";

/** Возвращает ссылку, баланс и результаты приглашений текущего исполнителя. */
export async function fetchReferralOverview(signal: AbortSignal): Promise<ReferralOverview> {
  const response = await fetchWithSession(`${API_URL}/referrals/me`, {
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить приглашения"));
  }

  return response.json();
}
