import { request } from "@/shared/api/request";

/** Добавляет публикацию в сохранённое или убирает её оттуда. */
export async function togglePostSave(id: number, saved: boolean): Promise<void> {
  await request(`/posts/${id}/save`, {
    method: saved ? "POST" : "DELETE",
    errorMessage: "Не удалось изменить сохранённое",
  });
}
