import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type { TechDiagCatalogs, TechDiagHolderProfile, TechDiagProfile } from "./types";

export function fetchTechDiagCatalogs(): Promise<TechDiagCatalogs> {
  return getJson("/directions/tech-diag/catalogs", "Не удалось загрузить справочники направления");
}

export function fetchTechDiagProfile(): Promise<TechDiagProfile> {
  return getJson("/directions/tech-diag/expert-profile", "Не удалось загрузить анкету специалиста НК");
}

export function saveTechDiagProfile(profile: TechDiagProfile): Promise<TechDiagProfile> {
  return putJson(
    "/directions/tech-diag/expert-profile",
    profile,
    "Не удалось сохранить анкету специалиста НК",
  );
}

export function fetchTechDiagHolderProfile(): Promise<TechDiagHolderProfile> {
  return getJson(
    "/directions/tech-diag/license-holder-profile",
    "Не удалось загрузить анкету лаборатории",
  );
}

export function saveTechDiagHolderProfile(
  profile: TechDiagHolderProfile,
): Promise<TechDiagHolderProfile> {
  return putJson(
    "/directions/tech-diag/license-holder-profile",
    profile,
    "Не удалось сохранить анкету лаборатории",
  );
}

export function uploadTechDiagDocument(file: File): Promise<TechDiagProfile> {
  return postFile(
    "/directions/tech-diag/expert-profile/documents",
    file,
    "Не удалось загрузить документ",
  );
}

export function deleteTechDiagDocument(url: string): Promise<TechDiagProfile> {
  return deleteWithBody(
    "/directions/tech-diag/expert-profile/documents",
    { url },
    "Не удалось удалить документ",
  );
}
