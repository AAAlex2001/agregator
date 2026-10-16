import { request } from "@/shared/api/request";
import type { AuditCustomerProfileValues } from "../model/types";

/** Загружает должность представителя и лицензию заказчика аудита. */
export async function getAuditCustomerProfile(): Promise<AuditCustomerProfileValues> {
  const response = await request("/directions/audit/customer-profile", {
    errorMessage: "Не удалось загрузить анкету заказчика",
  });

  return response.json();
}
