import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ReactionState, ReactionValue } from "../model/types";

function base(articleId: number): string {
  return `${API_URL}/public/articles/${articleId}`;
}

export async function fetchReactions(articleId: number): Promise<ReactionState> {
  const response = await fetchWithSession(`${base(articleId)}/reactions`);
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось загрузить оценки"));
  return response.json();
}

export async function sendReaction(articleId: number, value: ReactionValue): Promise<ReactionState> {
  const response = await fetchWithSession(`${base(articleId)}/reaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось сохранить оценку"));
  return response.json();
}
