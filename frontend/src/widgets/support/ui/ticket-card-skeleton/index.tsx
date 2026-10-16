import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Заглушка одной карточки обращения в списке. */
export function TicketCardSkeleton() {
  return (
    <li className={styles.item}>
      <div className={styles.top}>
        <Skeleton
          className={styles.number}
          rounded="pill"
        />
        <Skeleton
          className={styles.status}
          rounded="pill"
        />
      </div>
      <Skeleton
        className={styles.subject}
        rounded="pill"
      />
      <Skeleton
        className={styles.preview}
        rounded="pill"
      />
      <Skeleton
        className={styles.previewShort}
        rounded="pill"
      />
      <div className={styles.bottom}>
        <Skeleton
          className={styles.category}
          rounded="pill"
        />
        <Skeleton
          className={styles.date}
          rounded="pill"
        />
      </div>
    </li>
  );
}
