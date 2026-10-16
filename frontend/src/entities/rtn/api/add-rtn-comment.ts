import { request } from "@/shared/api/request";
import type { RtnComment } from "../model/types";
import type { RtnFile } from "../model/types";

/** Отправляет новый комментарий или ответ с ранее загруженными вложениями. */
export async function addRtnComment(
  clarificationId: number,
  text: string,
  parentId: number | null,
  attachments: RtnFile[],
): Promise<RtnComment> {
  const response = await request(
    `/public/rtn/clarifications/${clarificationId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        parent_id: parentId,
        attachments,
      }),
      errorMessage: "Не удалось отправить комментарий",
    },
  );

  return response.json();
}
