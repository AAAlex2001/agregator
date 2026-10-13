import { send } from "@/source/shared/api/request";
import type { ReferralOverview } from "../model/types";

/** Ссылка, баланс и результаты приглашений текущего исполнителя. */
export async function fetchReferralOverview(): Promise<ReferralOverview> {
  const response = await send("/referrals/me", { cache: "no-store" }, "Не удалось загрузить приглашения");
  return response.json();
}
