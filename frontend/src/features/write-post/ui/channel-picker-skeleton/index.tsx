import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Заглушка списка каналов: две строки с флажком, названием и сведениями. */
export function ChannelPickerSkeleton() {
  return (
    <ul
      className={styles.list}
      aria-hidden="true"
    >
      <ChannelRowSkeleton />
      <ChannelRowSkeleton />
    </ul>
  );
}

/** Заглушка одной строки выбора канала. */
function ChannelRowSkeleton() {
  return (
    <li className={styles.item}>
      <Skeleton
        className={styles.box}
        rounded="sm"
      />
      <span className={styles.text}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.meta} />
      </span>
    </li>
  );
}
