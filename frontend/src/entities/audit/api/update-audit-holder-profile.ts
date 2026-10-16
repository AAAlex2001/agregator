import { request } from "@/shared/api/request";
import type { AuditHolderProfileValues } from "../model/types";

/** Сохраняет свидетельство и области аккредитации инспекционного органа. */
export async function updateAuditHolderProfile(
  fields: AuditHolderProfileValues,
): Promise<AuditHolderProfileValues> {
  const response = await request("/directions/audit/license-holder-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету инспекционного органа",
  });

  return response.json();
}
