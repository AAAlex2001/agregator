import type { LicenseHolderUpdatePayload, UserProfile } from "../model/types";
import { json, send, upload } from "@/source/shared/api/request";

/** Сохранить номер лицензии, объекты экспертизы, стоимость предоставления и номера дополнительных документов. */
export async function updateLicenseHolderProfile(payload: LicenseHolderUpdatePayload): Promise<UserProfile> {
  const response = await send("/settings/license", json("PUT", payload), "Не удалось сохранить лицензию");
  return response.json();
}

/** Загрузить файл лицензии ЭПБ. */
export async function uploadLicenseFile(file: File): Promise<UserProfile> {
  const response = await upload("/settings/license-file", file, "Не удалось загрузить файл лицензии");
  return response.json();
}

/** Загрузить карточку предприятия. */
export async function uploadCompanyCard(file: File): Promise<UserProfile> {
  const response = await upload("/settings/company-card", file, "Не удалось загрузить карточку предприятия");
  return response.json();
}

/** Удалить карточку предприятия. */
export async function deleteCompanyCard(): Promise<UserProfile> {
  const response = await send("/settings/company-card", { method: "DELETE" }, "Не удалось удалить карточку предприятия");
  return response.json();
}

/** Загрузить файл лицензии маркшейдера. */
export async function uploadMiningLicenseFile(file: File): Promise<UserProfile> {
  const response = await upload(
    "/settings/mining-license-file",
    file,
    "Не удалось загрузить файл лицензии маркшейдера",
  );
  return response.json();
}

/** Загрузить выписку из реестра СРО проектировщиков. */
export async function uploadSroDesignFile(file: File): Promise<UserProfile> {
  const response = await upload("/settings/sro-design-file", file, "Не удалось загрузить файл выписки СРО");
  return response.json();
}

/** Загрузить выписку из реестра СРО изыскателей. */
export async function uploadSroSurveyFile(file: File): Promise<UserProfile> {
  const response = await upload("/settings/sro-survey-file", file, "Не удалось загрузить файл выписки СРО");
  return response.json();
}

/** Загрузить свидетельство об аккредитации лаборатории. */
export async function uploadLabAccreditationFile(file: File): Promise<UserProfile> {
  const response = await upload(
    "/settings/lab-accreditation-file",
    file,
    "Не удалось загрузить файл аккредитации",
  );
  return response.json();
}
