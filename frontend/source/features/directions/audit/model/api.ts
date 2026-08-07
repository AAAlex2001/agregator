import type { DirectionFile } from "../../shared/model/files";
import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type {
  AuditCatalogs,
  AuditCustomerProfile,
  AuditExpertProfile,
  AuditLicenseHolderProfile,
} from "./types";

export function fetchAuditCatalogs(): Promise<AuditCatalogs> {
  return getJson("/directions/audit/catalogs", "Не удалось загрузить справочники аудита");
}

export function fetchAuditCustomerProfile(): Promise<AuditCustomerProfile> {
  return getJson("/directions/audit/customer-profile", "Не удалось загрузить анкету заказчика");
}

export function saveAuditCustomerProfile(
  profile: AuditCustomerProfile,
): Promise<AuditCustomerProfile> {
  return putJson("/directions/audit/customer-profile", profile, "Не удалось сохранить анкету заказчика");
}

export function fetchAuditExpertProfile(): Promise<AuditExpertProfile> {
  return getJson("/directions/audit/expert-profile", "Не удалось загрузить анкету аудитора");
}

export function saveAuditExpertProfile(profile: AuditExpertProfile): Promise<AuditExpertProfile> {
  return putJson("/directions/audit/expert-profile", profile, "Не удалось сохранить анкету аудитора");
}

export function fetchAuditLicenseHolderProfile(): Promise<AuditLicenseHolderProfile> {
  return getJson(
    "/directions/audit/license-holder-profile",
    "Не удалось загрузить анкету инспекционного органа",
  );
}

export function saveAuditLicenseHolderProfile(
  profile: AuditLicenseHolderProfile,
): Promise<AuditLicenseHolderProfile> {
  return putJson(
    "/directions/audit/license-holder-profile",
    profile,
    "Не удалось сохранить анкету инспекционного органа",
  );
}

export function uploadAuditDocument(file: File): Promise<AuditExpertProfile> {
  return postFile("/directions/audit/expert-profile/documents", file, "Не удалось загрузить документ");
}

export function deleteAuditDocument(url: string): Promise<AuditExpertProfile> {
  return deleteWithBody(
    "/directions/audit/expert-profile/documents",
    { url },
    "Не удалось удалить документ",
  );
}

export function uploadAuditOrderFile(file: File): Promise<DirectionFile> {
  return postFile("/directions/audit/order-files", file, "Не удалось загрузить файл");
}
