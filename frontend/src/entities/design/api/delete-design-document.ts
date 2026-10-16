import { request } from "@/shared/api/request";
import type { DesignDocumentGroup, DesignProfile } from "../model/types";

/** Удаляет документ из выбранной группы и возвращает обновлённую анкету. */
export async function deleteDesignDocument(
  group: DesignDocumentGroup,
  url: string,
): Promise<DesignProfile> {
  const response = await request(
    `/directions/design/expert-profile/documents?group=${group}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
      errorMessage: "Не удалось удалить документ.",
    },
  );

  return response.json();
}
