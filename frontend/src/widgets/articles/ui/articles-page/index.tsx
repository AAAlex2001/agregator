import { ArticleListProvider, ArticlesSlider } from "@/entities/article";
import type {
  ArticleKind,
  ArticleListItem,
  ArticleListPage,
} from "@/entities/article";
import { ArticleFilters } from "@/features/filter-articles";
import { LoadMoreArticles } from "@/features/load-more-articles";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { ArticleList } from "../article-list";
import styles from "./style.module.scss";

/** Подборка из соседнего раздела под основным списком статей. */
interface ArticleCrossSection {
  title: string;
  href: string;
  hrefLabel: string;
  items: ArticleListItem[];
}

/** Серверная страница статей, заголовки и адреса текущего раздела приложения. */
interface ArticlesPageProps {
  kind: ArticleKind;
  title: string;
  subtitle: string;
  initialPage: ArticleListPage;
  initialOffset?: number;
  homeHref?: string;
  sectionHrefPrefix?: string;
  nextPageHref?: string;
  cross?: ArticleCrossSection;
}

/** Собирает страницу новостей или блога из фильтров, карточек и соседней подборки. */
export function ArticlesPage({
  kind,
  title,
  subtitle,
  initialPage,
  initialOffset = 0,
  homeHref = "/",
  sectionHrefPrefix = "",
  nextPageHref,
  cross,
}: ArticlesPageProps) {
  return (
    <ArticleListProvider
      kind={kind}
      initialPage={initialPage}
      initialOffset={initialOffset}
    >
      <div className={styles.wrapper}>
        <Breadcrumbs
          items={[
            {
              label: "Главная",
              href: homeHref,
            },
            {
              label: kind === "news" ? "Новости" : "Блог",
            },
          ]}
        />
        <div className={styles.head}>
          <Title
            text={title}
            as="h1"
            className={styles.title}
          />
          <Subtitle
            text={subtitle}
            className={styles.subtitle}
          />
        </div>

        <ArticleFilters />
        <ArticleList sectionHrefPrefix={sectionHrefPrefix} />
        <LoadMoreArticles nextPageHref={nextPageHref} />

        {cross && (
          <ArticlesSlider
            title={cross.title}
            items={cross.items}
            sectionHrefPrefix={sectionHrefPrefix}
            cta={{
              href: cross.href,
              label: cross.hrefLabel,
            }}
          />
        )}
      </div>
    </ArticleListProvider>
  );
}
