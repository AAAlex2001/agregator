import { uploadForm } from "@/shared/api/upload-form";
import type { Ticket } from "../model/types";

/** Отправляет ответ в обращение и возвращает его с обновлённой перепиской. */
export async function replyToTicket(
  id: number,
  text: string,
  files: File[],
): Promise<Ticket> {
  /** Собирает форму заново при повторной отправке перечитанных файлов. */
  function createBody(attached: File[]): FormData {
    const body = new FormData();

    body.append("text", text);
    attached.forEach((file) => body.append("files", file));

    return body;
  }

  const response = await uploadForm(`/support/tickets/${id}/messages`, {
    method: "POST",
    files,
    createBody,
    errorMessage: "Не удалось отправить сообщение",
  });

  return response.json();
}
