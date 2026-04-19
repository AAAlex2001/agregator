import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./OrderCardSkeleton.module.scss";

interface OrderCardSkeletonProps {
  showActions?: boolean;
}

export function OrderCardSkeleton({ showActions = true }: OrderCardSkeletonProps) {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.badges}>
        <Skeleton className={s.badge} rounded="pill" />
        <Skeleton className={s.badgeShort} rounded="pill" />
      </div>

      <div className={s.titleWrap}>
        <Skeleton className={s.title} />
        <Skeleton className={s.titleShort} />
      </div>

      <div className={s.meta}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={s.metaRow}>
            <Skeleton className={s.label} rounded="pill" />
            <Skeleton className={index % 2 === 0 ? s.valueWide : s.value} rounded="pill" />
          </div>
        ))}
      </div>

      {showActions ? (
        <div className={s.actions}>
          <Skeleton className={s.actionPrimary} rounded="pill" />
          <Skeleton className={s.actionSecondary} rounded="pill" />
        </div>
      ) : null}
    </article>
  );
}