import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размер карточки статьи, пока загружается список. */
export function ArticleCardSkeleton() {
  return (
    <div
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.body}>
        <Skeleton
          className={styles.cover}
          rounded="md"
        />
        <div className={styles.info}>
          <Skeleton
            className={styles.title}
            rounded="md"
          />
          <Skeleton
            className={styles.line}
            rounded="md"
          />
          <Skeleton
            className={styles.lineShort}
            rounded="md"
          />
        </div>
      </div>
      <div className={styles.footer}>
        <Skeleton
          className={styles.date}
          rounded="pill"
        />
        <Skeleton
          className={styles.read}
          rounded="pill"
        />
      </div>
    </div>
  );
}
