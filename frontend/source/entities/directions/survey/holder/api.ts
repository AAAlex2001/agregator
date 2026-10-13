import { json, send, upload } from "@/source/shared/api/request";
import { sroHolderFromApi, sroHolderToApi, type SroHolderProfile } from "../../shared/model/sroHolder";

/** Анкета члена СРО изыскателей. */
export async function fetchSurveyHolderProfile(): Promise<SroHolderProfile> {
  const response = await send("/directions/survey/license-holder-profile", {}, "Не удалось загрузить анкету члена СРО");
  return sroHolderFromApi(await response.json());
}

/** Сохранить анкету члена СРО изыскателей. */
export async function saveSurveyHolderProfile(profile: SroHolderProfile): Promise<SroHolderProfile> {
  const response = await send(
    "/directions/survey/license-holder-profile",
    json("PUT", sroHolderToApi(profile)),
    "Не удалось сохранить анкету члена СРО",
  );
  return sroHolderFromApi(await response.json());
}

/** Загрузить дополнительный документ члена СРО. */
export async function uploadSurveyHolderDocument(file: File): Promise<SroHolderProfile> {
  const response = await upload("/directions/survey/license-holder-profile/documents", file, "Не удалось загрузить документ");
  return sroHolderFromApi(await response.json());
}

/** Удалить дополнительный документ члена СРО. */
export async function deleteSurveyHolderDocument(url: string): Promise<SroHolderProfile> {
  const response = await send(
    "/directions/survey/license-holder-profile/documents",
    json("DELETE", { url }),
    "Не удалось удалить документ",
  );
  return sroHolderFromApi(await response.json());
}
