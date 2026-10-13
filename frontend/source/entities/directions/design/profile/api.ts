import { json, send, upload } from "@/source/shared/api/request";
import type { DesignDocumentGroup, DesignProfile } from "./types";

/** Анкета проектировщика. */
export async function fetchDesignProfile(): Promise<DesignProfile> {
  const response = await send("/directions/design/expert-profile", {}, "Не удалось загрузить анкету проектировщика");
  return response.json();
}

/** Сохранить анкету проектировщика. */
export async function saveDesignProfile(profile: DesignProfile): Promise<DesignProfile> {
  const response = await send("/directions/design/expert-profile", json("PUT", profile), "Не удалось сохранить анкету проектировщика");
  return response.json();
}

/** Загрузить документ проектировщика в группу: образование, НОК, НРС, курсы, РТН. */
export async function uploadDesignDocument(group: DesignDocumentGroup, file: File): Promise<DesignProfile> {
  const response = await upload(`/directions/design/expert-profile/documents?group=${group}`, file, "Не удалось загрузить документ");
  return response.json();
}

/** Удалить документ проектировщика из группы. */
export async function deleteDesignDocument(group: DesignDocumentGroup, url: string): Promise<DesignProfile> {
  const response = await send(
    `/directions/design/expert-profile/documents?group=${group}`,
    json("DELETE", { url }),
    "Не удалось удалить документ",
  );
  return response.json();
}
