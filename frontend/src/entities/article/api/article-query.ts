import type { ArticleListQuery } from "../model/types";

/** Записывает пагинацию и непустые фильтры в параметры запроса статей. */
export function createArticleQuery(query: ArticleListQuery): URLSearchParams {
  const params = new URLSearchParams({ kind: query.kind });

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  if (query.offset !== undefined) {
    params.set("offset", String(query.offset));
  }

  if (query.tag) {
    params.set("tag", query.tag);
  }

  if (query.direction) {
    params.set("direction", query.direction);
  }

  return params;
}
