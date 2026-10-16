import { request } from "@/shared/api/request";
import type { AuditHolderProfileValues } from "../model/types";

/** Загружает свидетельство и области аккредитации инспекционного органа. */
export async function getAuditHolderProfile(): Promise<AuditHolderProfileValues> {
  const response = await request("/directions/audit/license-holder-profile", {
    errorMessage: "Не удалось загрузить анкету инспекционного органа",
  });

  return response.json();
}
