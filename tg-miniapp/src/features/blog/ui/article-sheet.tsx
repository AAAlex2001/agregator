import { FullSheet, SheetHero, Spinner } from "@/shared/ui";
import { formatDayRu, pluralRu } from "@/shared/lib/format";
import { articleImage } from "@/entites/article";
import { useArticle } from "../model/use-article";
import { ArticleReactions } from "./article-reactions";
import s from "./article-sheet.module.scss";

interface Props {
  slug: string | null;
  onClose: () => void;
}

const KIND_LABEL: Record<string, string> = { news: "Новости", blog: "Блог платформы" };

export function ArticleSheet({ slug, onClose }: Props) {
  const { article } = useArticle(slug);

  const desc = article
    ? [article.published_at ? formatDayRu(article.published_at) : null, `${article.views_count} ${pluralRu(article.views_count, "просмотр", "просмотра", "просмотров")}`]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <FullSheet
      open={slug !== null}
      onClose={onClose}
      hero={
        article && (
          <SheetHero
            light={articleImage(article)}
            dark={articleImage(article)}
            label={KIND_LABEL[article.kind] ?? "Блог платформы"}
            title={article.title}
            desc={desc}
            onClose={onClose}
          />
        )
      }
    >
      {article === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : (
        <>
          <article className={s.prose} dangerouslySetInnerHTML={{ __html: article.content_html }} />
          <ArticleReactions articleId={article.id} />
        </>
      )}
    </FullSheet>
  );
}
