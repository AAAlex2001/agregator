import { request } from "@/shared/api/request";
import type { ReferralOverview } from "../model/types";

/** Загружает ссылку, баланс и результаты приглашений текущего исполнителя. */
export async function getReferralOverview(): Promise<ReferralOverview> {
  const response = await request("/referrals/me", {
    errorMessage: "Не удалось загрузить приглашения",
  });

  return response.json();
}
