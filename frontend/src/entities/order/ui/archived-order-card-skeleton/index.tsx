import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры архивной карточки, пока загружается список заказов. */
export function ArchivedOrderCardSkeleton() {
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
          <div className={styles.titleBlock}>
            <Skeleton
              className={styles.titleLabel}
              rounded="pill"
            />
            <Skeleton
              className={styles.title}
              rounded="md"
            />
            <Skeleton
              className={styles.titleShort}
              rounded="md"
            />
          </div>
          <Skeleton
            className={styles.badges}
            rounded="pill"
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
          {[1, 2, 3, 4].map((key) => (
            <div
              key={key}
              className={styles.rightItem}
            >
              <Skeleton
                className={styles.label}
                rounded="pill"
              />
              <Skeleton
                className={styles.value}
                rounded="pill"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.detailsSection}>
          <Skeleton
            className={styles.sectionTitle}
            rounded="pill"
          />
          <Skeleton
            className={styles.commentLine}
            rounded="md"
          />
          <Skeleton
            className={styles.commentLineShort}
            rounded="md"
          />
        </div>
      </div>
    </article>
  );
}
