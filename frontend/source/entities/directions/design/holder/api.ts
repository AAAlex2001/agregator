import { json, send, upload } from "@/source/shared/api/request";
import { sroHolderFromApi, sroHolderToApi, type SroHolderProfile } from "../../shared/model/sroHolder";

/** Анкета члена СРО проектировщиков. */
export async function fetchDesignHolderProfile(): Promise<SroHolderProfile> {
  const response = await send("/directions/design/license-holder-profile", {}, "Не удалось загрузить анкету члена СРО");
  return sroHolderFromApi(await response.json());
}

/** Сохранить анкету члена СРО проектировщиков. */
export async function saveDesignHolderProfile(profile: SroHolderProfile): Promise<SroHolderProfile> {
  const response = await send(
    "/directions/design/license-holder-profile",
    json("PUT", sroHolderToApi(profile)),
    "Не удалось сохранить анкету члена СРО",
  );
  return sroHolderFromApi(await response.json());
}

/** Загрузить дополнительный документ члена СРО. */
export async function uploadDesignHolderDocument(file: File): Promise<SroHolderProfile> {
  const response = await upload("/directions/design/license-holder-profile/documents", file, "Не удалось загрузить документ");
  return sroHolderFromApi(await response.json());
}

/** Удалить дополнительный документ члена СРО. */
export async function deleteDesignHolderDocument(url: string): Promise<SroHolderProfile> {
  const response = await send(
    "/directions/design/license-holder-profile/documents",
    json("DELETE", { url }),
    "Не удалось удалить документ",
  );
  return sroHolderFromApi(await response.json());
}
