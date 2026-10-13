import { ArticleCardSkeleton } from "@/source/entities/article";
import { RelatedSlider } from "@/source/shared/ui/RelatedSlider";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ArticleSkeleton.module.scss";

/** Заглушка страницы статьи, пока сервер отдаёт текст. */
export function ArticleSkeleton() {
  return (
    <article className={s.wrapper} aria-busy="true">
      <Skeleton className={s.breadcrumbs} rounded="md" />

      <div className={s.head}>
        <Skeleton className={s.title} rounded="md" />
        <Skeleton className={s.subtitle} rounded="md" />
      </div>

      <div className={s.layout}>
        <div className={s.body}>
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
          <Skeleton className={s.cover} rounded="lg" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.line} rounded="md" />
          <Skeleton className={s.lineShort} rounded="md" />
        </div>
        <Skeleton className={s.toc} rounded="lg" />
      </div>

      <RelatedSlider title="Смотрите также">
        {[1, 2, 3].map((key) => (
          <ArticleCardSkeleton key={key} />
        ))}
      </RelatedSlider>
    </article>
  );
}
