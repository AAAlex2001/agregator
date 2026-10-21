import { request } from "@/shared/api/request";
import type { BlitzAuditCatalog } from "../model/audit-types";

/** Справочники анкеты аудита и перечень документов. */
export async function getBlitzAuditCatalog(): Promise<BlitzAuditCatalog> {
  const response = await request("/blitz/audit/catalog", {
    errorMessage: "Не удалось загрузить справочник аудита",
  });

  return response.json();
}