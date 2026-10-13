import { PostCardSkeleton } from "./PostCardSkeleton";
import s from "./skeleton.module.scss";

/** Показывает две карточки на время загрузки ленты. */
export function PostsSkeleton() {
  return (
    <div className={s.list}>
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
