import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет место четырёх карточек, пока загружаются отзывы. */
export function PublicReviewsSkeleton() {
  return (
    <div
      className={styles.list}
      aria-busy="true"
    >
      {[1, 2, 3, 4].map((card) => (
        <article
          key={card}
          className={styles.card}
          aria-hidden="true"
        >
          <Skeleton
            className={styles.meta}
            rounded="pill"
          />
          <Skeleton
            className={styles.title}
            rounded="md"
          />
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Skeleton
                key={star}
                className={styles.star}
                rounded="sm"
              />
            ))}
          </div>
          <Skeleton
            className={styles.commentLine}
            rounded="md"
          />
          <Skeleton
            className={styles.commentLineShort}
            rounded="md"
          />
          <Skeleton
            className={styles.bottomLine}
            rounded="pill"
          />
        </article>
      ))}
    </div>
  );
}
