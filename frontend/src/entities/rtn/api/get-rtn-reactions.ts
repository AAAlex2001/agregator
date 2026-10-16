import { request } from "@/shared/api/request";
import type { RtnReactions } from "../model/types";

/** Загружает счётчики разъяснения с оценкой текущего посетителя. */
export async function getRtnReactions(clarificationId: number): Promise<RtnReactions> {
  const response = await request(
    `/public/rtn/clarifications/${clarificationId}/reactions`,
    {
      errorMessage: "Не удалось загрузить оценки",
    },
  );

  return response.json();
}
