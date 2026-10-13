import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { json, send } from "@/source/shared/api/request";
import type { RtnDetail, RtnList, RtnListItem, RtnListQuery, RtnReactionState, RtnReactionValue, RtnTaxonomy } from "../model/clarification";

interface FetchOptions {
  server?: boolean;
}

/** Каталог читается без сессии; с сервера Next ходим по внутреннему адресу API. */
function publicUrl(path: string, options: FetchOptions): string {
  return `${options.server ? SERVER_API_URL : API_URL}/public/rtn${path}`;
}

/** Справочники для фильтров каталога. */
export async function fetchRtnTaxonomy(options: FetchOptions = {}): Promise<RtnTaxonomy> {
  const response = await fetch(publicUrl("/taxonomy", options), { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось загрузить справочник фильтров: ${response.status}`);
  return response.json();
}

/** Страница каталога. Фильтры — строка запроса страницы каталога: имена параметров совпадают с API. */
export async function fetchRtnList(query: RtnListQuery, options: FetchOptions = {}): Promise<RtnList> {
  const params = new URLSearchParams(query.filters);
  params.set("limit", String(query.limit));
  params.set("offset", String(query.offset));
  const response = await fetch(publicUrl(`/clarifications?${params}`, options), { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось загрузить разъяснения: ${response.status}`);
  return response.json();
}

/** Разъяснение по адресу или null, если его нет. */
export async function fetchRtnBySlug(slug: string, options: FetchOptions = {}): Promise<RtnDetail | null> {
  const response = await fetch(publicUrl(`/clarifications/${encodeURIComponent(slug)}`, options), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Не удалось загрузить разъяснение: ${response.status}`);
  return response.json();
}

/** Похожие разъяснения для слайдера; при ошибке слайдер просто не показывается. */
export async function fetchRelatedRtn(slug: string, limit: number, options: FetchOptions = {}): Promise<RtnListItem[]> {
  const response = await fetch(publicUrl(`/clarifications/${encodeURIComponent(slug)}/related?limit=${limit}`, options), {
    cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}

/** Лайки, дизлайки, просмотры и своя оценка. */
export async function fetchRtnReactions(clarificationId: number): Promise<RtnReactionState> {
  const response = await send(`/public/rtn/clarifications/${clarificationId}/reactions`, {}, "Не удалось загрузить оценки");
  return response.json();
}

/** Поставить или сменить оценку разъяснению. */
export async function sendRtnReaction(clarificationId: number, value: RtnReactionValue): Promise<RtnReactionState> {
  const response = await send(
    `/public/rtn/clarifications/${clarificationId}/reaction`,
    json("POST", { value }),
    "Не удалось сохранить оценку",
  );
  return response.json();
}

/** Засчитать просмотр. Счётчик не критичен, поэтому ошибки глотаем. */
export async function recordRtnView(clarificationId: number): Promise<void> {
  await fetchWithSession(`${API_URL}/public/rtn/clarifications/${clarificationId}/view`, { method: "POST" }).catch(() => undefined);
}

/** Сообщить модератору, что разъяснение устарело или в нём ошибка. */
export async function reportRtnChange(clarificationId: number, description: string): Promise<void> {
  await send(
    `/public/rtn/clarifications/${clarificationId}/change-report`,
    json("POST", { description }),
    "Не удалось отправить сообщение",
  );
}
