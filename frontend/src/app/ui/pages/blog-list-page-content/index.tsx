import { BLOG_PAGE_SIZE } from "@/entities/article";
import { getArticlesOnServer } from "@/entities/article/server";
import { ArticlesPage } from "@/widgets/articles";
import { MAX_LINKED_BLOG_PAGE } from "../../../config/article-pagination";

/** Подзаголовок списка статей блога. */
const BLOG_SUBTITLE =
  "Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой промышленной безопасности";

/** Количество серверных страниц и префикс публичного или кабинетного раздела. */
interface BlogListPageContentProps {
  page: number;
  sectionHrefPrefix?: string;
}

/** Загружает блог с начала до выбранной страницы и подборку свежих новостей. */
export async function BlogListPageContent({
  page,
  sectionHrefPrefix = "",
}: BlogListPageContentProps) {
  const [initialPage, news] = await Promise.all([
    getArticlesOnServer({
      kind: "blog",
      limit: BLOG_PAGE_SIZE * page,
      offset: 0,
    }),
    getArticlesOnServer({
      kind: "news",
      limit: 10,
      offset: 0,
    }),
  ]);
  const nextPageHref = initialPage.has_more && page < MAX_LINKED_BLOG_PAGE
    ? `${sectionHrefPrefix}/blog?page=${page + 1}`
    : undefined;

  return (
    <ArticlesPage
      key={`blog-${page}`}
      kind="blog"
      title="Блог платформы"
      subtitle={BLOG_SUBTITLE}
      initialPage={initialPage}
      homeHref={sectionHrefPrefix || "/"}
      sectionHrefPrefix={sectionHrefPrefix}
      nextPageHref={nextPageHref}
      cross={{
        title: "Свежие новости отрасли",
        href: `${sectionHrefPrefix}/news`,
        hrefLabel: "Все новости",
        items: news.items,
      }}
    />
  );
}
