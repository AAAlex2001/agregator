import { request } from "@/shared/api/request";
import type { AuditCustomerProfileValues } from "../model/types";

/** Сохраняет сведения представителя заказчика аудита СУПБ. */
export async function updateAuditCustomerProfile(
  fields: AuditCustomerProfileValues,
): Promise<AuditCustomerProfileValues> {
  const response = await request("/directions/audit/customer-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fields),
    errorMessage: "Не удалось сохранить анкету заказчика",
  });

  return response.json();
}
