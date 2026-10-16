/** Сообщение, когда загруженные исполнители не подходят под выбранные фильтры. */
export const NO_MATCH_TEXT =
  "По выбранным фильтрам исполнителей не нашлось — снимите часть фильтров";

/** Выбирает подпись загрузки, пустого направления или отсутствия совпадений. */
export function getMapEmptyText(isLoading: boolean, total: number): string {
  if (isLoading) {
    return "Загрузка карты исполнителей…";
  }

  if (total > 0) {
    return NO_MATCH_TEXT;
  }

  return "Пока нет исполнителей этого направления";
}
