import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Заглушка карточки канала: аватар, название, сведения и две кнопки. */
export function ChannelCardSkeleton() {
  return (
    <div
      className={styles.card}
      aria-hidden="true"
    >
      <Skeleton
        className={styles.avatar}
        rounded="pill"
      />
      <div className={styles.body}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.meta} />
      </div>
      <div className={styles.actions}>
        <Skeleton className={styles.button} />
        <Skeleton className={styles.button} />
      </div>
    </div>
  );
}
