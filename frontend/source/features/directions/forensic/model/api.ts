import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type { ForensicProfile } from "./types";

const LOAD_FAILED = "Не удалось загрузить анкету судебного эксперта";
const SAVE_FAILED = "Не удалось сохранить анкету судебного эксперта";

export function fetchForensicProfile(): Promise<ForensicProfile> {
  return getJson("/directions/forensic/profile", LOAD_FAILED);
}

export function saveForensicProfile(profile: ForensicProfile): Promise<ForensicProfile> {
  return putJson("/directions/forensic/profile", profile, SAVE_FAILED);
}

export function uploadForensicDiploma(file: File): Promise<ForensicProfile> {
  return postFile("/directions/forensic/profile/diploma", file, "Не удалось загрузить диплом");
}

export function uploadForensicDocument(file: File): Promise<ForensicProfile> {
  return postFile("/directions/forensic/profile/documents", file, "Не удалось загрузить документ");
}

export function deleteForensicDocument(url: string): Promise<ForensicProfile> {
  return deleteWithBody("/directions/forensic/profile/documents", { url }, "Не удалось удалить документ");
}
