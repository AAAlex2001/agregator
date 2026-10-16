"use client";

import {
  ARTICLE_DIRECTION_OPTIONS,
  useArticleList,
  useFilterArticles,
} from "@/entities/article";
import { Select } from "@/shared/ui/select";
import styles from "./style.module.scss";

/** Фильтрует публикации по направлению и тегам первой серверной страницы. */
export function ArticleFilters() {
  const { filters, availableTags } = useArticleList();
  const filterArticles = useFilterArticles();
  const tagOptions = [
    {
      value: "",
      label: "Все теги",
    },
    ...availableTags.map((tag) => ({
      value: tag,
      label: tag,
    })),
  ];

  /** Меняет направление, сохраняя выбранный тег. */
  function changeDirection(direction: string) {
    void filterArticles({
      ...filters,
      direction,
    });
  }

  /** Меняет тег, сохраняя выбранное направление. */
  function changeTag(tag: string) {
    void filterArticles({
      ...filters,
      tag,
    });
  }

  return (
    <div className={styles.filters}>
      <Select
        options={ARTICLE_DIRECTION_OPTIONS}
        value={filters.direction}
        onChange={changeDirection}
        ariaLabel="Направление"
        className={styles.select}
      />
      {availableTags.length > 0 && (
        <Select
          options={tagOptions}
          value={filters.tag}
          onChange={changeTag}
          ariaLabel="Тег"
          className={styles.select}
        />
      )}
    </div>
  );
}
