import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Значок и текст одного преимущества тарифа в заготовке. */
function FeatureSkeleton() {
  return (
    <li className={styles.feature}>
      <Skeleton
        className={styles.checkIcon}
        rounded="pill"
      />
      <Skeleton
        className={styles.featureText}
        rounded="md"
      />
    </li>
  );
}

/** Сохраняет размеры карточки тарифа, пока загружаются данные. */
export function PricingCardSkeleton() {
  return (
    <article
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        <div className={styles.infoBlock}>
          <div className={styles.pillsBlock}>
            <div className={styles.pillsRow}>
              <Skeleton
                className={styles.pillName}
                rounded="pill"
              />
              <Skeleton
                className={styles.pillBadge}
                rounded="pill"
              />
            </div>
            <Skeleton
              className={styles.price}
              rounded="md"
            />
          </div>
          <Skeleton
            className={styles.description}
            rounded="md"
          />
        </div>
        <Skeleton
          className={styles.button}
          rounded="pill"
        />
      </div>

      <ul className={styles.features}>
        <FeatureSkeleton />
        <FeatureSkeleton />
        <FeatureSkeleton />
      </ul>
    </article>
  );
}
