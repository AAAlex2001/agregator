import { request } from "@/shared/api/request";

/** Отключает канал: бот перестаёт туда публиковать. */
export async function disconnectChannel(id: number): Promise<void> {
  await request(`/poster/channels/${id}`, {
    method: "DELETE",
    errorMessage: "Не удалось отключить канал",
  });
}
