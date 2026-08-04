import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type { CadastralProfile } from "./types";

const LOAD_FAILED = "Не удалось загрузить анкету кадастрового инженера";
const SAVE_FAILED = "Не удалось сохранить анкету кадастрового инженера";

export function fetchCadastralProfile(): Promise<CadastralProfile> {
  return getJson("/directions/cadastral/profile", LOAD_FAILED);
}

export function saveCadastralProfile(profile: CadastralProfile): Promise<CadastralProfile> {
  return putJson("/directions/cadastral/profile", profile, SAVE_FAILED);
}

export function uploadCadastralDiploma(file: File): Promise<CadastralProfile> {
  return postFile("/directions/cadastral/profile/diploma", file, "Не удалось загрузить диплом");
}

export function uploadCadastralCertificate(file: File): Promise<CadastralProfile> {
  return postFile("/directions/cadastral/profile/certificate", file, "Не удалось загрузить аттестат");
}

export function uploadCadastralDocument(file: File): Promise<CadastralProfile> {
  return postFile("/directions/cadastral/profile/documents", file, "Не удалось загрузить документ");
}

export function deleteCadastralDocument(url: string): Promise<CadastralProfile> {
  return deleteWithBody("/directions/cadastral/profile/documents", { url }, "Не удалось удалить документ");
}
