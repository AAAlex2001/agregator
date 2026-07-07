import { Button, FullSheet, Spinner } from "@/shared/ui";
import { articleImage } from "@/entites/article";
import { shareUrl } from "@/shared/services/telegram";
import { useArticle } from "../model/use-article";
import { ArticleHero } from "./article-hero";
import { ArticleReactions } from "./article-reactions";
import s from "./article-sheet.module.scss";

interface Props {
  slug: string | null;
  onClose: () => void;
}

function splitTrailingImage(html: string): { body: string; trailing: string } {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const last = doc.body.lastElementChild;
  if (last && (last.tagName === "IMG" || last.tagName === "FIGURE" || last.querySelector("img"))) {
    const trailing = last.outerHTML;
    last.remove();
    return { body: doc.body.innerHTML.trim(), trailing };
  }
  return { body: html, trailing: "" };
}

export function ArticleSheet({ slug, onClose }: Props) {
  const { article } = useArticle(slug);
  const content = article ? splitTrailingImage(article.content_html) : { body: "", trailing: "" };
  const articleUrl = article ? `https://plus-resurs.com/${article.kind}/${article.slug}` : "";

  return (
    <FullSheet
      open={slug !== null}
      onClose={onClose}
      hero={article && <ArticleHero image={articleImage(article)} title={article.title} onClose={onClose} />}
    >
      {article === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : (
        <>
          <article className={s.prose} dangerouslySetInnerHTML={{ __html: content.body }} />
          <Button
            type="button"
            variant="outline"
            className={s.shareButton}
            onClick={() => shareUrl(articleUrl, article.title)}
          >
            Поделиться
          </Button>
          <ArticleReactions articleId={article.id} />
          {content.trailing && <div className={s.prose} dangerouslySetInnerHTML={{ __html: content.trailing }} />}
        </>
      )}
    </FullSheet>
  );
}
