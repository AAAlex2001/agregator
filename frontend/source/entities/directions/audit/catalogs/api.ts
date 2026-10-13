import { send } from "@/source/shared/api/request";
import type { AuditCatalogs } from "./types";

/** Справочники аудита СУПБ: области промбезопасности, аттестации, квалификации, аккредитации и направления аудита. */
export async function fetchAuditCatalogs(): Promise<AuditCatalogs> {
  const response = await send("/directions/audit/catalogs", {}, "Не удалось загрузить справочники аудита");
  return response.json();
}
