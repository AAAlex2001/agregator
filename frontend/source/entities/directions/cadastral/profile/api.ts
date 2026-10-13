import { json, send, upload } from "@/source/shared/api/request";
import type { CadastralProfile } from "./types";

/** Анкета кадастрового инженера. */
export async function fetchCadastralProfile(): Promise<CadastralProfile> {
  const response = await send("/directions/cadastral/profile", {}, "Не удалось загрузить анкету кадастрового инженера");
  return response.json();
}

/** Сохранить анкету кадастрового инженера. */
export async function saveCadastralProfile(profile: CadastralProfile): Promise<CadastralProfile> {
  const response = await send(
    "/directions/cadastral/profile",
    json("PUT", profile),
    "Не удалось сохранить анкету кадастрового инженера",
  );
  return response.json();
}

/** Загрузить диплом об образовании. */
export async function uploadCadastralDiploma(file: File): Promise<CadastralProfile> {
  const response = await upload("/directions/cadastral/profile/diploma", file, "Не удалось загрузить диплом");
  return response.json();
}

/** Загрузить квалификационный аттестат. */
export async function uploadCadastralCertificate(file: File): Promise<CadastralProfile> {
  const response = await upload("/directions/cadastral/profile/certificate", file, "Не удалось загрузить аттестат");
  return response.json();
}

/** Загрузить дополнительный документ. */
export async function uploadCadastralDocument(file: File): Promise<CadastralProfile> {
  const response = await upload("/directions/cadastral/profile/documents", file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить дополнительный документ. */
export async function deleteCadastralDocument(url: string): Promise<CadastralProfile> {
  const response = await send("/directions/cadastral/profile/documents", json("DELETE", { url }), "Не удалось удалить документ");
  return response.json();
}
