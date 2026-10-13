import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./RtnCardSkeleton.module.scss";

/** Заглушка карточки каталога, пока грузится список. */
export function RtnCardSkeleton() {
  return (
    <li className={s.card} aria-hidden="true">
      <div className={s.top}>
        <Skeleton className={s.type} rounded="pill" />
        <Skeleton className={s.status} rounded="pill" />
      </div>
      <Skeleton className={s.titleLine} rounded="md" />
      <Skeleton className={s.titleLineShort} rounded="md" />
      <Skeleton className={s.excerptLine} rounded="sm" />
      <Skeleton className={s.excerptLineShort} rounded="sm" />
      <Skeleton className={s.meta} rounded="pill" />
    </li>
  );
}
