import { request } from "@/shared/api/request";

/** Передаёт модератору сообщение об устаревшем или неточном разъяснении. */
export async function reportRtnChange(
  clarificationId: number,
  description: string,
): Promise<void> {
  await request(`/public/rtn/clarifications/${clarificationId}/change-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
    errorMessage: "Не удалось отправить сообщение",
  });
}
