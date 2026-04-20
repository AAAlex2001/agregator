import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./NotificationCardSkeleton.module.scss";

export function NotificationCardSkeleton() {
  return (
    <div className={s.card} aria-hidden="true">
      <Skeleton className={s.title} rounded="sm" />
      <Skeleton className={s.line} rounded="sm" />
      <Skeleton className={s.lineShort} rounded="sm" />
      <Skeleton className={s.time} rounded="sm" />
    </div>
  );
}
