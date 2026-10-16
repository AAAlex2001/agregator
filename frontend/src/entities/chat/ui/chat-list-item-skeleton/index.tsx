import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры строки диалога, пока загружается список. */
export function ChatListItemSkeleton() {
  return (
    <div
      className={styles.item}
      aria-hidden="true"
    >
      <Skeleton
        className={styles.avatar}
        rounded="pill"
      />
      <div className={styles.meta}>
        <Skeleton className={styles.name} />
        <Skeleton
          className={styles.preview}
          rounded="pill"
        />
      </div>
      <Skeleton
        className={styles.time}
        rounded="pill"
      />
    </div>
  );
}
