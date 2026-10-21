import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Заготовка карточки заявки на время загрузки. */
export function BlitzOrderCardSkeleton() {
  return (
    <div
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.head}>
        <Skeleton className={styles.number} />
        <Skeleton className={styles.badge} />
      </div>
      <Skeleton className={styles.title} />
      <Skeleton className={styles.meta} />
      <div className={styles.foot}>
        <Skeleton className={styles.price} />
        <Skeleton className={styles.date} />
      </div>
    </div>
  );
}
