import type { ReactNode } from "react";
import {
  ArticleContent,
  detectArticleDirection,
  splitByMiddleHeading,
  splitTrailingImage,
} from "@/entities/article";
import type {
  Article,
  ArticleComment,
  ArticleReactions,
} from "@/entities/article";
import { RateArticle } from "@/features/rate-article";
import { ArticleViewTracker } from "@/features/record-article-view";
import { ShareArticleButton } from "@/features/share-article";
import { LeadForm } from "@/features/submit-lead";
import { SITE_URL } from "@/shared/config/site";
import { ArticleDiscussion } from "../article-discussion";
import styles from "./style.module.scss";

/** Статья с размеченным текстом, приглашение к регистрации и начальные реакции. */
interface ArticleBodyProps {
  article: Article;
  html: string;
  registration: ReactNode;
  initialReactions?: ArticleReactions;
  initialComments: ArticleComment[];
}

/** Размещает приглашение посередине длинной статьи, заявку, оценку и обсуждение. */
export function ArticleBody({
  article,
  html,
  registration,
  initialReactions,
  initialComments,
}: ArticleBodyProps) {
  const publicUrl = `${SITE_URL}/${article.kind}/${article.slug}`;
  const [before, after] = splitByMiddleHeading(html);
  const [tail, trailingImage] = splitTrailingImage(after || before);
  const textBefore = after ? before : tail;
  const textAfter = after ? tail : "";
  const leadDirection = article.direction ?? detectArticleDirection(html);

  return (
    <div className={styles.body}>
      <ArticleContent html={textBefore} />
      {registration}
      {textAfter && (
        <ArticleContent html={textAfter} />
      )}
      <LeadForm defaultDirection={leadDirection} />
      {trailingImage && (
        <ArticleContent
          html={trailingImage}
          wideImage
        />
      )}
      <ArticleViewTracker articleId={article.id} />
      <ShareArticleButton url={publicUrl} />
      <RateArticle
        articleId={article.id}
        initial={initialReactions}
      />
      <ArticleDiscussion
        articleId={article.id}
        initialComments={initialComments}
      />
    </div>
  );
}
