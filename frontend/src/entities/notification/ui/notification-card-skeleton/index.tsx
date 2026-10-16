import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры карточки уведомления, пока загружается лента. */
export function NotificationCardSkeleton() {
  return (
    <div
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.message}>
        <div className={styles.titleRow}>
          <Skeleton
            className={styles.title}
            rounded="sm"
          />
          <Skeleton
            className={styles.close}
            rounded="sm"
          />
        </div>
        <div className={styles.info}>
          <Skeleton
            className={styles.line}
            rounded="sm"
          />
          <Skeleton
            className={styles.lineShort}
            rounded="sm"
          />
          <Skeleton
            className={styles.actionButton}
            rounded="md"
          />
          <Skeleton
            className={styles.time}
            rounded="sm"
          />
        </div>
      </div>
    </div>
  );
}
