import { SERVER_API_URL } from "@/source/shared/api/config";
import { json, send } from "@/source/shared/api/request";
import type { ReactionState, ReactionValue } from "../model/types";

/** Лайки, дизлайки, просмотры и своя оценка. На сервере Next читается без сессии. */
export async function fetchReactions(articleId: number, options: { server?: boolean } = {}): Promise<ReactionState> {
  const path = `/public/articles/${articleId}/reactions`;
  const response = options.server
    ? await fetch(`${SERVER_API_URL}${path}`, { cache: "no-store" })
    : await send(path, {}, "Не удалось загрузить оценки");
  if (!response.ok) throw new Error(`Не удалось загрузить оценки: ${response.status}`);
  return response.json();
}

/** Поставить или сменить оценку статье. */
export async function sendReaction(articleId: number, value: ReactionValue): Promise<ReactionState> {
  const response = await send(`/public/articles/${articleId}/reaction`, json("POST", { value }), "Не удалось сохранить оценку");
  return response.json();
}
