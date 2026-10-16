import type { ReactNode } from "react";
import { ArticlesSlider } from "@/entities/article";
import type {
  Article,
  ArticleComment,
  ArticleListItem,
  ArticleReactions,
} from "@/entities/article";
import { LEAD_FORM_ID } from "@/entities/lead";
import { extractToc } from "@/shared/lib/extract-toc";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { DocumentToc } from "@/shared/ui/document-toc";
import { ArticleBody } from "../article-body";
import { ArticleHeading } from "../article-heading";
import styles from "./style.module.scss";

/** Серверные данные статьи и блок регистрации, связанный с приложением. */
interface ArticleDetailProps {
  article: Article;
  related: ArticleListItem[];
  initialReactions?: ArticleReactions;
  initialComments: ArticleComment[];
  registration: ReactNode;
  homeHref?: string;
  sectionHrefPrefix?: string;
}

/** Собирает текст статьи, оглавление, заявку, обсуждение и похожие материалы. */
export function ArticleDetail({
  article,
  related,
  initialReactions,
  initialComments,
  registration,
  homeHref = "/",
  sectionHrefPrefix = "",
}: ArticleDetailProps) {
  const sectionTitle = article.kind === "news" ? "Новости" : "Блог";
  const sectionHref = `${sectionHrefPrefix}/${article.kind}`;
  const { html, toc: headings } = extractToc(article.content_html);
  const leadItem = {
    id: LEAD_FORM_ID,
    num: String(headings.length + 1).padStart(2, "0"),
    label: "Оставить заявку",
  };
  const toc = headings.length > 0 ? [...headings, leadItem] : headings;

  return (
    <article className={styles.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: sectionTitle, href: sectionHref },
          { label: article.title },
        ]}
      />
      <ArticleHeading article={article} />
      <div className={styles.layout}>
        {toc.length > 0 && (
          <DocumentToc
            items={toc}
            className={styles.toc}
          />
        )}
        <ArticleBody
          article={article}
          html={html}
          registration={registration}
          initialReactions={initialReactions}
          initialComments={initialComments}
        />
      </div>
      <ArticlesSlider
        title="Смотрите также"
        items={related}
        sectionHrefPrefix={sectionHrefPrefix}
      />
    </article>
  );
}
