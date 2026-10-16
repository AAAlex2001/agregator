import { request } from "@/shared/api/request";
import type { UpdateLicenseTerms } from "../model/types";
import type { UserProfile } from "../model/types";

/** Сохраняет реквизиты лицензии и условия её предоставления. */
export async function updateLicenseTerms(fields: UpdateLicenseTerms): Promise<UserProfile> {
  const response = await request("/settings/license", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить лицензию",
  });

  return response.json();
}
