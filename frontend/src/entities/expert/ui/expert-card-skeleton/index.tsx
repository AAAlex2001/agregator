import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Подпись и значение показателя исполнителя. */
function StatSkeleton() {
  return (
    <div className={styles.statRow}>
      <Skeleton
        className={styles.statLabel}
        rounded="pill"
      />
      <Skeleton
        className={styles.statValue}
        rounded="pill"
      />
    </div>
  );
}

/** Подпись и значение поля в средней или правой колонке. */
function FieldSkeleton() {
  return (
    <div className={styles.field}>
      <Skeleton
        className={styles.fieldLabel}
        rounded="pill"
      />
      <Skeleton
        className={styles.fieldValue}
        rounded="pill"
      />
    </div>
  );
}

/** Сохраняет размеры карточки исполнителя, пока загружается список. */
export function ExpertCardSkeleton() {
  return (
    <article
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.header}>
            <Skeleton
              className={styles.avatar}
              rounded="pill"
            />
            <div className={styles.headerText}>
              <Skeleton
                className={styles.name}
                rounded="pill"
              />
              <Skeleton
                className={styles.joined}
                rounded="pill"
              />
            </div>
          </div>
          <div className={styles.stats}>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
          <Skeleton
            className={styles.button}
            rounded="md"
          />
        </div>

        <div className={styles.center}>
          <Skeleton
            className={styles.centerLabel}
            rounded="pill"
          />
          <Skeleton
            className={styles.meta}
            rounded="pill"
          />
          <div className={styles.field}>
            <Skeleton
              className={styles.fieldLabel}
              rounded="pill"
            />
            <Skeleton
              className={styles.title}
              rounded="pill"
            />
          </div>
          <FieldSkeleton />
        </div>

        <div className={styles.side}>
          <div className={styles.field}>
            <Skeleton
              className={styles.fieldLabel}
              rounded="pill"
            />
            <Skeleton
              className={styles.fieldAccent}
              rounded="pill"
            />
          </div>
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </div>
    </article>
  );
}
