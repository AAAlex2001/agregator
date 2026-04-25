import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./PricingCard.module.scss";
import sk from "./PricingCardSkeleton.module.scss";

export function PricingCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.inner}>
        <div className={s.infoBlock}>
          <div className={s.pillsBlock}>
            <div className={s.pillsRow}>
              <Skeleton className={sk.pillName} rounded="pill" />
              <Skeleton className={sk.pillBadge} rounded="pill" />
            </div>
            <Skeleton className={sk.price} rounded="md" />
          </div>
          <Skeleton className={sk.description} rounded="md" />
        </div>
        <Skeleton className={sk.button} rounded="pill" />
      </div>

      <ul className={s.features}>
        <li className={s.feature}>
          <Skeleton className={sk.checkIcon} rounded="pill" />
          <Skeleton className={sk.featureText} rounded="md" />
        </li>
        <li className={s.feature}>
          <Skeleton className={sk.checkIcon} rounded="pill" />
          <Skeleton className={sk.featureText} rounded="md" />
        </li>
        <li className={s.feature}>
          <Skeleton className={sk.checkIcon} rounded="pill" />
          <Skeleton className={sk.featureText} rounded="md" />
        </li>
      </ul>
    </article>
  );
}
