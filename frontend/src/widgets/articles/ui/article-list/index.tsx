"use client";

import {
  ArticleCard,
  ArticleCardSkeleton,
  useArticleList,
} from "@/entities/article";
import styles from "./style.module.scss";

/** Префикс адресов статей публичного раздела или кабинета. */
interface ArticleListProps {
  sectionHrefPrefix: string;
}

/** Показывает статьи, пустой список и заглушки обновления или догрузки. */
export function ArticleList({ sectionHrefPrefix }: ArticleListProps) {
  const { items, operation, kind } = useArticleList();

  if (operation === "filtering") {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <ArticleCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        {kind === "news"
          ? "Новостей пока нет — заходите позже."
          : "Статей пока нет — заходите позже."}
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {items.map((article) => (
        <li key={article.id}>
          <ArticleCard
            article={article}
            href={`${sectionHrefPrefix}/${article.kind}/${article.slug}`}
          />
        </li>
      ))}
      {operation === "loading-more" && (
        [1, 2, 3].map((key) => (
          <li
            key={`more-${key}`}
            aria-hidden="true"
          >
            <ArticleCardSkeleton />
          </li>
        ))
      )}
    </ul>
  );
}
