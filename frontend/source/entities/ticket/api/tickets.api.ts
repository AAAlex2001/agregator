import { send, sendForm } from "@/source/shared/api/request";
import type { NewTicket, Ticket, TicketList } from "../model/types";

/** Обращения пользователя, свежие первыми. */
export async function fetchTickets(offset: number, limit: number): Promise<TicketList> {
  const response = await send(`/support/tickets?skip=${offset}&limit=${limit}`, {}, "Не удалось загрузить обращения");
  return response.json();
}

/** Обращение с перепиской. Открытие помечает ответы поддержки прочитанными. */
export async function fetchTicket(id: number): Promise<Ticket> {
  const response = await send(`/support/tickets/${id}`, {}, "Не удалось загрузить обращение");
  return response.json();
}

/** Создать обращение с первым сообщением и файлами. */
export async function createTicket(ticket: NewTicket): Promise<Ticket> {
  const response = await sendForm(
    "/support/tickets",
    "POST",
    ticket.files,
    (files) => {
      const body = new FormData();
      body.append("subject", ticket.subject);
      body.append("category", ticket.category);
      body.append("message", ticket.message);
      files.forEach((file) => body.append("files", file));
      return body;
    },
    "Не удалось создать обращение",
  );
  return response.json();
}

/** Ответить в обращении. Возвращает обращение с обновлённой перепиской. */
export async function replyToTicket(id: number, text: string, files: File[]): Promise<Ticket> {
  const response = await sendForm(
    `/support/tickets/${id}/messages`,
    "POST",
    files,
    (attached) => {
      const body = new FormData();
      body.append("text", text);
      attached.forEach((file) => body.append("files", file));
      return body;
    },
    "Не удалось отправить сообщение",
  );
  return response.json();
}
