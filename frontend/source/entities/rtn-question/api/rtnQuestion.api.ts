import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { RtnQuestion } from "../model/types";

export async function fetchMyRtnQuestions(): Promise<RtnQuestion[]> {
  const response = await fetchWithSession(`${API_URL}/rtn/questions/mine`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Не удалось загрузить ваши вопросы"));
  }
  return response.json();
}
