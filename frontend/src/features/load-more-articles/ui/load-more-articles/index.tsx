"use client";

import { useArticleList, useLoadMoreArticles } from "@/entities/article";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Адрес следующей серверной страницы для списка без фильтров. */
interface LoadMoreArticlesProps {
  nextPageHref?: string;
}

/** Открывает следующую страницу или догружает отфильтрованные статьи на месте. */
export function LoadMoreArticles({ nextPageHref }: LoadMoreArticlesProps) {
  const { filters, hasMore, operation } = useArticleList();
  const loadMoreArticles = useLoadMoreArticles();
  const isFiltered = Boolean(filters.tag || filters.direction);

  if (operation === "filtering") {
    return null;
  }

  if (nextPageHref && !isFiltered) {
    return (
      <div className={styles.loadMore}>
        <Button
          href={nextPageHref}
          scroll={false}
          variant="outline"
          className={styles.loadMoreButton}
        >
          Показать ещё
        </Button>
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <div className={styles.loadMore}>
      <Button
        type="button"
        variant="outline"
        className={styles.loadMoreButton}
        onClick={loadMoreArticles}
        isLoading={operation === "loading-more"}
      >
        Показать ещё
      </Button>
    </div>
  );
}
