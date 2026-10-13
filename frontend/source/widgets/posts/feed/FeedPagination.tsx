import { postFeedUrl } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import s from "../posts.module.scss";

interface FeedPaginationProps {
  page: number;
  pages: number;
  authorId?: number;
}

/** Ссылки на соседние страницы ленты: по ним ходят и читатели, и поисковые роботы. */
export function FeedPagination({ page, pages, authorId }: FeedPaginationProps) {
  if (pages <= 1) return null;

  return (
    <nav className={s.pagination} aria-label="Страницы публикаций">
      {page > 1 && (
        <Button href={postFeedUrl(page - 1, authorId)} variant="outline">
          ← Предыдущая
        </Button>
      )}
      <span className={s.pageNumber}>
        Страница {page} из {pages}
      </span>
      {page < pages && (
        <Button href={postFeedUrl(page + 1, authorId)} variant="outline">
          Следующая →
        </Button>
      )}
    </nav>
  );
}
