import { uploadForm } from "@/shared/api/upload-form";
import type { NewTicket, Ticket } from "../model/types";

/** Создаёт обращение с первым сообщением и приложенными файлами. */
export async function createTicket(ticket: NewTicket): Promise<Ticket> {
  /** Собирает форму заново при повторной отправке перечитанных файлов. */
  function createBody(files: File[]): FormData {
    const body = new FormData();

    body.append("subject", ticket.subject);
    body.append("category", ticket.category);
    body.append("message", ticket.message);
    files.forEach((file) => body.append("files", file));

    return body;
  }

  const response = await uploadForm("/support/tickets", {
    method: "POST",
    files: ticket.files,
    createBody,
    errorMessage: "Не удалось создать обращение",
  });

  return response.json();
}
