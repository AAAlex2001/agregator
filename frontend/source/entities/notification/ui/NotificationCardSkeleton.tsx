import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./NotificationCardSkeleton.module.scss";

export function NotificationCardSkeleton() {
  return (
    <div className={s.card} aria-hidden="true">
      <div className={s.message}>
        <div className={s.titleRow}>
          <Skeleton className={s.title} rounded="sm" />
          <Skeleton className={s.close} rounded="sm" />
        </div>
        <div className={s.info}>
          <Skeleton className={s.line} rounded="sm" />
          <Skeleton className={s.lineShort} rounded="sm" />
          <Skeleton className={s.actionBtn} rounded="md" />
          <Skeleton className={s.time} rounded="sm" />
        </div>
      </div>
    </div>
  );
}
