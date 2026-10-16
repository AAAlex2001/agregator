import { request } from "@/shared/api/request";
import type { ExpertContact } from "../model/types";

/** Загружает каталог исполнителей с доступными текущему пользователю контактами. */
export async function getExpertContacts(): Promise<ExpertContact[]> {
  const response = await request("/expert-contacts?limit=500", {
    errorMessage: "Не удалось загрузить контакты исполнителей",
  });
  const data: { items: ExpertContact[] } = await response.json();

  return data.items;
}
