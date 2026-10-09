"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { fetchTags } from "@/entities/tag";
import { ARTICLES_PATH, articlePath } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { createArticle, deleteArticle, fetchArticle, updateArticle } from "../api/articles";
import { editorReducer } from "./reducers";
import type { Article, ArticleFields, ArticlePayload } from "./types";

const EMPTY_FIELDS: ArticleFields = {
  kind: "NEWS",
  status: "DRAFT",
  direction: "",
  slug: "",
  title: "",
  excerpt: "",
  coverImage: "",
  tgCoverImage: "",
  ogImage: "",
  tags: [],
  contentHtml: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  publishedAt: null,
};

/** Поля формы из статьи. */
const toFields = (article: Article): ArticleFields => ({
  kind: article.kind,
  status: article.status,
  direction: article.direction ?? "",
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  coverImage: article.cover_image,
  tgCoverImage: article.tg_cover_image,
  ogImage: article.og_image,
  tags: article.tags,
  contentHtml: article.content_html,
  metaTitle: article.meta_title,
  metaDescription: article.meta_description,
  metaKeywords: article.meta_keywords,
  publishedAt: article.published_at,
});

/** Данные для API из полей формы. */
const toPayload = (fields: ArticleFields): ArticlePayload => ({
  kind: fields.kind,
  status: fields.status,
  direction: fields.direction || null,
  slug: fields.slug.trim(),
  title: fields.title.trim(),
  excerpt: fields.excerpt.trim(),
  cover_image: fields.coverImage,
  tg_cover_image: fields.tgCoverImage,
  og_image: fields.ogImage,
  tags: fields.tags,
  content_html: fields.contentHtml,
  meta_title: fields.metaTitle.trim(),
  meta_description: fields.metaDescription.trim(),
  meta_keywords: fields.metaKeywords.trim(),
  published_at: fields.publishedAt,
});

/** Редактор статьи: загрузка, поля, сохранение и удаление. Без id — создание новой. */
export const useArticleEditor = (id: number | null) => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(editorReducer, {
    status: "loading",
    article: null,
    fields: EMPTY_FIELDS,
    tags: [],
    pending: false,
    confirming: false,
  });
  const { fields } = state;

  useEffect(() => {
    let active = true;

    Promise.all([id === null ? null : fetchArticle(id), fetchTags()])
      .then(([article, tags]) => {
        if (!active) return;

        if (article) dispatch({ type: "fields/change", changes: toFields(article) });
        dispatch({ type: "load/success", article, tags });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [id]);

  const change = (changes: Partial<ArticleFields>) => dispatch({ type: "fields/change", changes });

  const toggleTag = (name: string) =>
    change({ tags: fields.tags.includes(name) ? fields.tags.filter((tag) => tag !== name) : [...fields.tags, name] });

  /** Сохранить статью. Новая создаётся и открывается на редактирование. */
  const save = async () => {
    dispatch({ type: "save/start" });

    try {
      if (state.article) {
        const saved = await updateArticle(state.article.id, toPayload(fields));

        dispatch({ type: "load/success", article: saved, tags: state.tags });
        toast("Статья сохранена");
      } else {
        const created = await createArticle(toPayload(fields));

        toast("Статья создана");
        router.replace(articlePath(created.id));
      }
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить статью"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const remove = async () => {
    if (!state.article) return;

    dispatch({ type: "save/start" });

    try {
      await deleteArticle(state.article.id);
      toast("Статья удалена");
      router.replace(ARTICLES_PATH);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить статью"), "error");
      dispatch({ type: "save/finish" });
    }
  };

  const askRemove = () => dispatch({ type: "remove/ask" });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  return { state, change, toggleTag, save, remove, askRemove, cancelRemove };
};
