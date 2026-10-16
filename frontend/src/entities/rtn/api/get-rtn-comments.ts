import { request } from "@/shared/api/request";
import type { RtnComment, RtnCommentsResponse } from "../model/types";

/** Читает обсуждение с cookie, чтобы отметить свои комментарии и реакции. */
export async function getRtnComments(clarificationId: number): Promise<RtnComment[]> {
  const response = await request(
    `/public/rtn/clarifications/${clarificationId}/comments`,
    {
      errorMessage: "Не удалось загрузить обсуждение",
    },
  );
  const result: RtnCommentsResponse = await response.json();

  return result.items;
}
