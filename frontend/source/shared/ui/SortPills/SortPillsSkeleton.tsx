import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./SortPills.module.scss";

interface Props {
  count?: number;
}

export function SortPillsSkeleton({ count = 3 }: Props) {
  return (
    <div className={s.row} aria-hidden="true">
      <span className={s.title}>Сортировка:</span>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={s.skelPill} rounded="pill" />
      ))}
    </div>
  );
}
