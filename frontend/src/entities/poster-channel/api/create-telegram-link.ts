import { request } from "@/shared/api/request";

/** Ответ со ссылкой на бота. */
interface TelegramLink {
  url: string;
}

/** Одноразовая ссылка на бота: привязать Telegram и выбрать канал. */
export async function createTelegramLink(): Promise<string> {
  const response = await request("/telegram/link", {
    method: "POST",
    errorMessage: "Не удалось открыть бота",
  });
  const link: TelegramLink = await response.json();

  return link.url;
}
