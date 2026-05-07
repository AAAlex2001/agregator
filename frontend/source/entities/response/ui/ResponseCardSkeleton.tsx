import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ResponseCardSkeleton.module.scss";

export function ResponseCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.body}>
        <div className={s.left}>
          <div className={s.headRow}>
            <Skeleton className={s.meta} rounded="pill" />
            <Skeleton className={s.statusBadge} rounded="pill" />
          </div>
          <Skeleton className={s.title} rounded="md" />
          <Skeleton className={s.titleShort} rounded="md" />
          <div className={s.bottomLeft}>
            <Skeleton className={s.label} rounded="pill" />
            <Skeleton className={s.value} rounded="pill" />
          </div>
        </div>
        <div className={s.right}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.rightItem}>
              <Skeleton className={s.label} rounded="pill" />
              <Skeleton className={s.value} rounded="pill" />
            </div>
          ))}
        </div>
      </div>
      <div className={s.actions}>
        <Skeleton className={s.actionBtn} rounded="md" />
        <Skeleton className={s.actionBtn} rounded="md" />
      </div>
    </article>
  );
}
