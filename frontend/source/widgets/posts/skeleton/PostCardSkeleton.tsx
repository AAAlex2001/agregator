import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./skeleton.module.scss";

/** Повторяет расположение автора, текста, медиа и действий в карточке. */
export function PostCardSkeleton() {
  return (
    <div
      className={s.card}
      role="status"
      aria-label="Загружается публикация"
      aria-busy="true"
    >
      <div className={s.head}>
        <Skeleton
          className={s.avatar}
          rounded="pill"
        />
        <div className={s.author}>
          <Skeleton className={s.name} />
          <Skeleton className={s.date} />
        </div>
      </div>
      <div className={s.text}>
        <Skeleton className={s.line} />
        <Skeleton className={s.line} />
        <Skeleton className={s.shortLine} />
      </div>
      <Skeleton className={s.media} />
      <div className={s.actions}>
        <Skeleton className={s.action} />
        <Skeleton className={s.action} />
        <Skeleton className={s.action} />
        <Skeleton className={s.action} />
        <Skeleton className={s.action} />
      </div>
    </div>
  );
}
