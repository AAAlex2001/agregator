import { request } from "@/shared/api/request";
import { uploadWithProgress } from "@/shared/api/upload-with-progress";
import type { ExpertRoomMessage } from "../model/types";

/** Отправляет сообщение всем исполнителям; файлы уходят через XHR с процентом загрузки. */
export async function sendExpertRoomMessage(
  text: string,
  files: File[],
  onProgress: (percent: number) => void,
): Promise<ExpertRoomMessage> {
  const path = "/expert-room/messages";
  const errorMessage = "Не удалось отправить сообщение";
  const body = new FormData();

  body.append("text", text);
  files.forEach((file) => body.append("files", file));

  if (files.length === 0) {
    const response = await request(path, {
      method: "POST",
      body,
      errorMessage,
    });

    return response.json();
  }

  const response = await uploadWithProgress(path, {
    body,
    errorMessage,
    onProgress,
  });

  return response.json();
}
