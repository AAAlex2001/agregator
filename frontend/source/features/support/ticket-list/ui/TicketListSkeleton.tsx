import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./TicketListSkeleton.module.scss";

/** Заглушка списка обращений на время загрузки. */
export function TicketListSkeleton() {
  return (
    <div className={s.panel} aria-hidden="true">
      <div className={s.header}>
        <Skeleton className={s.title} rounded="pill" />
        <Skeleton className={s.count} rounded="pill" />
      </div>

      <ul className={s.list}>
        {[1, 2, 3, 4].map((key) => (
          <li key={key} className={s.item}>
            <div className={s.itemTop}>
              <Skeleton className={s.number} rounded="pill" />
              <Skeleton className={s.status} rounded="pill" />
            </div>
            <Skeleton className={s.subject} rounded="pill" />
            <Skeleton className={s.preview} rounded="pill" />
            <Skeleton className={s.previewShort} rounded="pill" />
            <div className={s.itemBottom}>
              <Skeleton className={s.category} rounded="pill" />
              <Skeleton className={s.date} rounded="pill" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
