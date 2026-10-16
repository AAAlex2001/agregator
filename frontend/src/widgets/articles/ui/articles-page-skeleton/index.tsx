import { ArticleCardSkeleton } from "@/entities/article";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет место заголовка и карточек во время серверной загрузки страницы. */
export function ArticlesPageSkeleton() {
  return (
    <div
      className={styles.wrapper}
      aria-busy="true"
    >
      <div className={styles.head}>
        <Skeleton
          className={styles.title}
          rounded="md"
        />
        <Skeleton
          className={styles.subtitle}
          rounded="md"
        />
      </div>
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((key) => (
          <ArticleCardSkeleton key={key} />
        ))}
      </div>
    </div>
  );
}
