import { request } from "@/shared/api/request";

/** Удаляет свой шаблон. */
export async function deleteTemplate(id: number): Promise<void> {
  await request(`/poster/templates/${id}`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить шаблон",
  });
}
