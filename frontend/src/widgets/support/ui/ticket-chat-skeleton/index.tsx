import cn from "classnames";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Заглушка переписки, пока загружается обращение. */
export function TicketChatSkeleton() {
  return (
    <div
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Skeleton
            className={styles.headerNumber}
            rounded="pill"
          />
          <Skeleton
            className={styles.headerSubject}
            rounded="pill"
          />
        </div>
        <Skeleton
          className={styles.headerStatus}
          rounded="pill"
        />
      </div>

      <div className={styles.thread}>
        <div className={cn(styles.row, styles.rowUser)}>
          <Skeleton
            className={styles.rowHead}
            rounded="pill"
          />
          <Skeleton
            className={cn(styles.bubble, styles.bubbleUser)}
            rounded="lg"
          />
        </div>
        <div className={cn(styles.row, styles.rowSupport)}>
          <Skeleton
            className={styles.rowHead}
            rounded="pill"
          />
          <Skeleton
            className={cn(styles.bubble, styles.bubbleSupport)}
            rounded="lg"
          />
        </div>
        <div className={cn(styles.row, styles.rowUser)}>
          <Skeleton
            className={styles.rowHead}
            rounded="pill"
          />
          <Skeleton
            className={cn(styles.bubble, styles.bubbleUserShort)}
            rounded="lg"
          />
        </div>
      </div>

      <Skeleton
        className={styles.composer}
        rounded="lg"
      />
    </div>
  );
}
