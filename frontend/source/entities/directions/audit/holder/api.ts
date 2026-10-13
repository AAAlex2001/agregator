import { json, send } from "@/source/shared/api/request";
import type { AuditLicenseHolderProfile } from "./types";

/** Анкета инспекционного органа. */
export async function fetchAuditLicenseHolderProfile(): Promise<AuditLicenseHolderProfile> {
  const response = await send("/directions/audit/license-holder-profile", {}, "Не удалось загрузить анкету инспекционного органа");
  return response.json();
}

/** Сохранить анкету инспекционного органа. */
export async function saveAuditLicenseHolderProfile(profile: AuditLicenseHolderProfile): Promise<AuditLicenseHolderProfile> {
  const response = await send(
    "/directions/audit/license-holder-profile",
    json("PUT", profile),
    "Не удалось сохранить анкету инспекционного органа",
  );
  return response.json();
}
