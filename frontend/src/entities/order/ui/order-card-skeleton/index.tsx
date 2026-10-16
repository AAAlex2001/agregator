import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Наличие действий в загружаемой карточке. */
interface OrderCardSkeletonProps {
  showActions?: boolean;
}

/** Заглушка одного условия заказа: подпись и значение. */
function DetailSkeleton() {
  return (
    <div className={styles.rightItem}>
      <Skeleton
        className={styles.label}
        rounded="pill"
      />
      <Skeleton
        className={styles.value}
        rounded="pill"
      />
    </div>
  );
}

/** Сохраняет размеры карточки заказа, пока загружаются её данные. */
export function OrderCardSkeleton({ showActions = true }: OrderCardSkeletonProps) {
  return (
    <article
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.headRow}>
            <Skeleton
              className={styles.meta}
              rounded="pill"
            />
            <Skeleton
              className={styles.statusBadge}
              rounded="pill"
            />
          </div>
          <Skeleton
            className={styles.title}
            rounded="md"
          />
          <Skeleton
            className={styles.titleShort}
            rounded="md"
          />
          <div className={styles.bottomLeft}>
            <Skeleton
              className={styles.label}
              rounded="pill"
            />
            <Skeleton
              className={styles.value}
              rounded="pill"
            />
          </div>
        </div>
        <div className={styles.right}>
          <DetailSkeleton />
          <DetailSkeleton />
          <DetailSkeleton />
          <DetailSkeleton />
        </div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <Skeleton
            className={styles.actionBtn}
            rounded="md"
          />
          <Skeleton
            className={styles.actionBtn}
            rounded="md"
          />
        </div>
      )}
    </article>
  );
}
