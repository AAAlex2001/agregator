import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Подпись и значение одного условия в правой колонке заготовки. */
function PropertySkeleton() {
  return (
    <div className={styles.rightItem}>
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

/** Заготовка карточки отклика на время загрузки списка. */
export function ResponseCardSkeleton() {
  return (
    <article
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.headRow}>
            <Skeleton
              className={styles.meta}
              rounded="pill"
            />
            <Skeleton
              className={styles.statusBadge}
              rounded="pill"
            />
          </div>
          <Skeleton
            className={styles.title}
            rounded="md"
          />
          <Skeleton
            className={styles.titleShort}
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
          <PropertySkeleton />
          <PropertySkeleton />
          <PropertySkeleton />
          <PropertySkeleton />
        </div>
      </div>
      <div className={styles.actions}>
        <Skeleton
          className={styles.actionButton}
          rounded="md"
        />
        <Skeleton
          className={styles.actionButton}
          rounded="md"
        />
      </div>
    </article>
  );
}
