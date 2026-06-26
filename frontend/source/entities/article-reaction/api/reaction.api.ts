import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ReactionState, ReactionValue } from "../model/types";

function url(articleId: number, path: string, server?: boolean): string {
  return `${server ? SERVER_API_URL : API_URL}/public/articles/${articleId}${path}`;
}

export async function fetchReactions(
  articleId: number,
  opts: { server?: boolean } = {},
): Promise<ReactionState> {
  const target = url(articleId, "/reactions", opts.server);
  const response = opts.server ? await fetch(target, { cache: "no-store" }) : await fetchWithSession(target);
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось загрузить оценки"));
  return response.json();
}

export async function sendReaction(articleId: number, value: ReactionValue): Promise<ReactionState> {
  const response = await fetchWithSession(url(articleId, "/reaction"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось сохранить оценку"));
  return response.json();
}
