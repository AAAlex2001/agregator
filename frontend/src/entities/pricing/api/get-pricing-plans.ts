import { readResponseError } from "@/shared/api/response-error";
import { API_URL } from "@/shared/config/api";
import type { PricingPlan, PricingPlansResponse } from "../model/types";

/** Загружает публичные тарифы в браузере без открытия или обновления сессии. */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  const response = await fetch(`${API_URL}/pricing/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, "Не удалось загрузить тарифы"));
  }

  const result: PricingPlansResponse = await response.json();
  return result.plans ?? [];
}
