import { request } from "@/shared/api/request";
import { uploadWithProgress } from "@/shared/api/upload-with-progress";
import type { ChatMessageData, ChatMessageDraft } from "../model/types";

/**
 * Отправляет сообщение; одинаковый clientMessageId не даёт серверу продублировать повтор.
 * Файлы уходят через XHR, чтобы показывать процент загрузки.
 */
export async function sendChatMessage(
  chatUuid: string,
  draft: ChatMessageDraft,
  onProgress: (percent: number) => void,
): Promise<ChatMessageData> {
  const path = `/chats/${chatUuid}/messages`;
  const errorMessage = "Не удалось отправить сообщение";
  const body = new FormData();

  body.append("text", draft.text);
  body.append("client_message_id", draft.clientMessageId);
  draft.files.forEach((file) => body.append("files", file));

  if (draft.files.length === 0) {
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
