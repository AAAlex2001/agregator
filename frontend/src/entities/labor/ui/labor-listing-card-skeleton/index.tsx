import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет место одной карточки объявления, пока загружается список. */
export function LaborListingCardSkeleton() {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <Skeleton
            className={styles.title}
            rounded="pill"
          />
          <Skeleton
            className={styles.kind}
            rounded="pill"
          />
        </div>
        <Skeleton
          className={styles.region}
          rounded="pill"
        />
      </div>

      <div className={styles.certificates}>
        <Skeleton
          className={styles.certificate}
          rounded="pill"
        />
        <Skeleton
          className={styles.certificateShort}
          rounded="pill"
        />
        <Skeleton
          className={styles.certificate}
          rounded="pill"
        />
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <Skeleton
            className={styles.metaLabel}
            rounded="pill"
          />
          <Skeleton
            className={styles.metaValue}
            rounded="pill"
          />
        </div>
        <div className={styles.metaItem}>
          <Skeleton
            className={styles.metaLabel}
            rounded="pill"
          />
          <Skeleton
            className={styles.metaValue}
            rounded="pill"
          />
        </div>
        <div className={styles.metaItem}>
          <Skeleton
            className={styles.metaLabel}
            rounded="pill"
          />
          <Skeleton
            className={styles.metaValue}
            rounded="pill"
          />
        </div>
      </div>

      <Skeleton
        className={styles.action}
        rounded="md"
      />
    </article>
  );
}
