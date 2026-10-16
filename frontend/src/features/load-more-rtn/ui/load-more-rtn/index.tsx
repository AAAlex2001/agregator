"use client";

import { useLoadMoreRtn, useRtnList } from "@/entities/rtn";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Ссылка на следующую индексируемую страницу публичного каталога. */
interface LoadMoreRtnProps {
  nextPageHref?: string;
}

/** Открывает серверную страницу или добавляет разъяснения к текущему списку. */
export function LoadMoreRtn({ nextPageHref }: LoadMoreRtnProps) {
  const { hasMore, isLoading } = useRtnList();
  const loadMore = useLoadMoreRtn();

  if (nextPageHref) {
    return (
      <Button
        href={nextPageHref}
        scroll={false}
        variant="outline"
        className={styles.more}
      >
        Показать ещё
      </Button>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={styles.more}
      onClick={loadMore}
      isLoading={isLoading}
    >
      Показать ещё
    </Button>
  );
}
