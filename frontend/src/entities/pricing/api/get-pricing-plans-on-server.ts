import "server-only";

import { readResponseError } from "@/shared/api/response-error";
import { SERVER_API_URL } from "@/shared/config/server-api";
import type { PricingPlan, PricingPlansResponse } from "../model/types";

/** Загружает тарифы для серверного HTML по внутреннему адресу API. */
export async function getPricingPlansOnServer(): Promise<PricingPlan[]> {
  const response = await fetch(`${SERVER_API_URL}/pricing/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, "Не удалось загрузить тарифы"));
  }

  const result: PricingPlansResponse = await response.json();
  return result.plans ?? [];
}
