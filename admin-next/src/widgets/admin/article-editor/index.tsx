"use client";

import { ArticleActions, ArticleForm, useArticleEditor } from "@/features/articles-admin";
import { SITE_URL } from "@/shared/api";
import { ARTICLES_PATH } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import { ExternalLinkIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import styles from "./style.module.scss";

type ArticleEditorProps = {
  articleId: number | null;
};

/** Редактирование статьи, а без articleId — создание новой. */
const ArticleEditor = ({ articleId }: ArticleEditorProps) => {
  const { state, change, toggleTag, save, remove, askRemove, cancelRemove } = useArticleEditor(articleId);
  const { article } = state;

  if (state.status === "loading") return <Loader size="lg" />;
  if (state.status === "failed") return <Message tone="error">Не удалось загрузить статью.</Message>;

  const publicUrl = article && `${SITE_URL}/${article.kind === "NEWS" ? "news" : "blog"}/${article.slug}`;

  return (
    <Page>
      <PageHeader
        backHref={ARTICLES_PATH}
        title={article ? article.title || "Без заголовка" : "Новая статья"}
        description={
          article
            ? `#${article.id} · обновлена ${formatDateTime(article.updated_at)}`
            : "Заполните поля и сохраните — статья появится в списке"
        }
        action={
          article && (
            <div className={styles.actions}>
              {article.status === "PUBLISHED" && publicUrl && (
                <Button variant="ghost" href={publicUrl} target="_blank">
                  <ExternalLinkIcon />
                  На сайте
                </Button>
              )}
              <ArticleActions
                title={article.title}
                confirming={state.confirming}
                pending={state.pending}
                onAskRemove={askRemove}
                onCancelRemove={cancelRemove}
                onRemove={remove}
              />
            </div>
          )
        }
      />

      <ArticleForm
        fields={state.fields}
        tags={state.tags}
        pending={state.pending}
        isNew={!article}
        onChange={change}
        onToggleTag={toggleTag}
        onSubmit={save}
      />
    </Page>
  );
};

export default ArticleEditor;
