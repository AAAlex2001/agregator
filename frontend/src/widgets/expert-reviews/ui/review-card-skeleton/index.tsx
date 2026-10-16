import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Звезда оценки на месте будущего рейтинга. */
function StarSkeleton() {
  return (
    <Skeleton
      className={styles.star}
      rounded="sm"
    />
  );
}

/** Строка правой колонки: подпись и значение условия заказа. */
function TermSkeleton() {
  return (
    <div className={styles.term}>
      <Skeleton
        className={styles.label}
        rounded="pill"
      />
      <Skeleton
        className={styles.value}
        rounded="pill"
      />
    </div>
  );
}

/** Сохраняет размеры карточки отзыва, пока загружается список. */
export function ReviewCardSkeleton() {
  return (
    <article
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.body}>
        <div className={styles.left}>
          <Skeleton
            className={styles.meta}
            rounded="pill"
          />
          <Skeleton
            className={styles.title}
            rounded="md"
          />
          <Skeleton
            className={styles.titleShort}
            rounded="md"
          />
          <div className={styles.stars}>
            <StarSkeleton />
            <StarSkeleton />
            <StarSkeleton />
            <StarSkeleton />
            <StarSkeleton />
          </div>
          <Skeleton
            className={styles.commentLine}
            rounded="md"
          />
          <Skeleton
            className={styles.commentLineShort}
            rounded="md"
          />
          <div className={styles.bottomLeft}>
            <Skeleton
              className={styles.label}
              rounded="pill"
            />
            <Skeleton
              className={styles.value}
              rounded="pill"
            />
          </div>
        </div>
        <div className={styles.right}>
          <TermSkeleton />
          <TermSkeleton />
          <TermSkeleton />
          <TermSkeleton />
        </div>
      </div>
    </article>
  );
}
