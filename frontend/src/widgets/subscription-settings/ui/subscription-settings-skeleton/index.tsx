import { PricingCardSkeleton } from "@/entities/pricing";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры статуса и трёх тарифов до ответа сервера. */
export function SubscriptionSettingsSkeleton() {
  return (
    <div
      className={styles.wrapper}
      aria-hidden="true"
    >
      <div className={styles.statusBlock}>
        <Skeleton className={styles.statusTitle} />
        <Skeleton className={styles.statusSubtitle} />
      </div>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <PricingCardSkeleton />
        </div>
        <div className={styles.gridItem}>
          <PricingCardSkeleton />
        </div>
        <div className={styles.gridItem}>
          <PricingCardSkeleton />
        </div>
      </div>
    </div>
  );
}
