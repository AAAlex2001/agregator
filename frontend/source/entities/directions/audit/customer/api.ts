import { json, send } from "@/source/shared/api/request";
import type { AuditCustomerProfile } from "./types";

/** Анкета заказчика аудита. */
export async function fetchAuditCustomerProfile(): Promise<AuditCustomerProfile> {
  const response = await send("/directions/audit/customer-profile", {}, "Не удалось загрузить анкету заказчика");
  return response.json();
}

/** Сохранить анкету заказчика аудита. */
export async function saveAuditCustomerProfile(profile: AuditCustomerProfile): Promise<AuditCustomerProfile> {
  const response = await send("/directions/audit/customer-profile", json("PUT", profile), "Не удалось сохранить анкету заказчика");
  return response.json();
}
