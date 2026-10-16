import { NEWS_PAGE_SIZE } from "@/entities/article";
import { getArticlesOnServer } from "@/entities/article/server";
import { ArticlesPage } from "@/widgets/articles";

/** Номер страницы и префикс публичного или кабинетного раздела. */
interface NewsListPageContentProps {
  page: number;
  sectionHrefPrefix?: string;
}

/** Загружает серверную страницу новостей и соседнюю подборку блога. */
export async function NewsListPageContent({
  page,
  sectionHrefPrefix = "",
}: NewsListPageContentProps) {
  const offset = (page - 1) * NEWS_PAGE_SIZE;
  const [initialPage, blog] = await Promise.all([
    getArticlesOnServer({
      kind: "news",
      limit: NEWS_PAGE_SIZE,
      offset,
    }),
    getArticlesOnServer({
      kind: "blog",
      limit: 10,
      offset: 0,
    }),
  ]);
  const nextPageHref = initialPage.has_more
    ? `${sectionHrefPrefix}/news?page=${page + 1}`
    : undefined;

  return (
    <ArticlesPage
      key={`news-${page}`}
      kind="news"
      title="Новости отрасли"
      subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
      initialPage={initialPage}
      initialOffset={offset}
      homeHref={sectionHrefPrefix || "/"}
      sectionHrefPrefix={sectionHrefPrefix}
      nextPageHref={nextPageHref}
      cross={{
        title: "Читайте также из блога",
        href: `${sectionHrefPrefix}/blog`,
        hrefLabel: "Все статьи",
        items: blog.items,
      }}
    />
  );
}
