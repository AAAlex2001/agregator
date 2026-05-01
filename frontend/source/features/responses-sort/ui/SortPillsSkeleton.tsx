import s from "./SortPills.module.scss";
import Skeleton from "@/source/shared/ui/Skeleton";

export function SortPillsSkeleton() {
  return (
    <div className={s.row} aria-hidden="true">
      <span className={s.title}>Сортировка:</span>
      <Skeleton className={s.skelPill} rounded="pill" />
      <Skeleton className={s.skelPill} rounded="pill" />
      <Skeleton className={s.skelPill} rounded="pill" />
    </div>
  );
}
