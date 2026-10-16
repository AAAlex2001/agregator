import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Заглушка одной строки с подписью события и переключателем. */
export function SwitchSkeleton() {
  return (
    <div className={styles.item}>
      <div className={styles.text}>
        <Skeleton
          className={styles.label}
          rounded="pill"
        />
        <Skeleton
          className={styles.description}
          rounded="pill"
        />
      </div>
      <Skeleton
        className={styles.track}
        rounded="pill"
      />
    </div>
  );
}
