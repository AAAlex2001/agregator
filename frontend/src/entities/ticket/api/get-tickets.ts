import { request } from "@/shared/api/request";
import type { TicketList } from "../model/types";

/** Загружает страницу обращений пользователя, свежие первыми. */
export async function getTickets(offset: number, limit: number): Promise<TicketList> {
  const response = await request(`/support/tickets?skip=${offset}&limit=${limit}`, {
    errorMessage: "Не удалось загрузить обращения",
  });

  return response.json();
}
