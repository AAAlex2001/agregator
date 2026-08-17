import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type { EcologyCatalogs, EcologyProfile } from "./types";

export function fetchEcologyCatalogs(): Promise<EcologyCatalogs> {
  return getJson("/directions/ecology/catalogs", "Не удалось загрузить справочник направления");
}

export function fetchEcologyProfile(): Promise<EcologyProfile> {
  return getJson("/directions/ecology/expert-profile", "Не удалось загрузить анкету эколога");
}

export function saveEcologyProfile(profile: EcologyProfile): Promise<EcologyProfile> {
  return putJson(
    "/directions/ecology/expert-profile",
    profile,
    "Не удалось сохранить анкету эколога",
  );
}

export function uploadEcologyDocument(file: File): Promise<EcologyProfile> {
  return postFile(
    "/directions/ecology/expert-profile/documents",
    file,
    "Не удалось загрузить документ",
  );
}

export function deleteEcologyDocument(url: string): Promise<EcologyProfile> {
  return deleteWithBody(
    "/directions/ecology/expert-profile/documents",
    { url },
    "Не удалось удалить документ",
  );
}
