import { request } from "@/shared/api/request";
import type { PostTemplate } from "../model/types";

/** Сохраняет текст из редактора шаблоном. */
export async function saveTemplate(title: string, html: string): Promise<PostTemplate> {
  const response = await request("/poster/templates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, html }),
    errorMessage: "Не удалось сохранить шаблон",
  });

  return response.json();
}
