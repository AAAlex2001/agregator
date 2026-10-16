import { Skeleton } from "@/shared/ui/skeleton";
import { TicketCardSkeleton } from "../ticket-card-skeleton";
import styles from "./style.module.scss";

/** Заглушка списка обращений на время загрузки. */
export function TicketListSkeleton() {
  return (
    <div
      className={styles.panel}
      aria-hidden="true"
    >
      <div className={styles.header}>
        <Skeleton
          className={styles.title}
          rounded="pill"
        />
        <Skeleton
          className={styles.count}
          rounded="pill"
        />
      </div>

      <ul className={styles.list}>
        <TicketCardSkeleton />
        <TicketCardSkeleton />
        <TicketCardSkeleton />
        <TicketCardSkeleton />
      </ul>
    </div>
  );
}
