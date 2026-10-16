import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры приглашения и статистики во время загрузки программы. */
export function ReferralSettingsSkeleton() {
  return (
    <section
      className={styles.panel}
      aria-busy="true"
      role="status"
      aria-label="Загружаем приглашения"
    >
      <div className={styles.card}>
        <div className={styles.copy}>
          <Skeleton className={styles.text} />
          <Skeleton className={styles.block} />
          <Skeleton className={styles.text} />
          <Skeleton className={styles.link} />
        </div>
        <Skeleton className={styles.artwork} />
      </div>
      <div className={styles.stats}>
        <Skeleton className={styles.block} />
        <Skeleton className={styles.block} />
        <Skeleton className={styles.block} />
      </div>
    </section>
  );
}
