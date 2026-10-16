import { request } from "@/shared/api/request";
import type { Ticket } from "../model/types";

/** Загружает обращение с перепиской; открытие помечает ответы поддержки прочитанными. */
export async function getTicket(id: number): Promise<Ticket> {
  const response = await request(`/support/tickets/${id}`, {
    errorMessage: "Не удалось загрузить обращение",
  });

  return response.json();
}
