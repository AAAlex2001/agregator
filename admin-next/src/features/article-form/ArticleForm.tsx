"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CoverUpload, Editor, useArticleForm } from "@/entities/article";
import { listTags } from "@/entities/tag";

export function ArticleForm({ id }: { id: number | null }) {
  const { state, setField, toggleTag, submit } = useArticleForm(id);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    listTags()
      .then((tags) => setAllTags(tags.map((t) => t.name)))
      .catch(() => {});
  }, []);

  if (!state.isLoaded) return <div className="center muted">Загрузка…</div>;

  const f = state.fields;
  const tagOptions = Array.from(new Set([...allTags, ...state.tags]));

  return (
    <div className="page">
      <header className="topbar">
        <h1>{id ? "Редактирование статьи" : "Новая статья"}</h1>
        <Link className="ghost" href="/">← К списку</Link>
      </header>

      {state.errorMessage && <div className="error">{state.errorMessage}</div>}

      <div className="form">
        <div className="row">
          <label>
            Тип
            <select value={f.kind} onChange={(e) => setField("kind", e.target.value)}>
              <option value="NEWS">Новость</option>
              <option value="BLOG">Блог</option>
            </select>
          </label>
          <label>
            Статус
            <select value={f.status} onChange={(e) => setField("status", e.target.value)}>
              <option value="DRAFT">Черновик</option>
              <option value="PUBLISHED">Опубликована</option>
            </select>
          </label>
        </div>

        <label>
          Заголовок
          <input value={f.title} onChange={(e) => setField("title", e.target.value)} />
          {state.errors.title && <span className="field-error">{state.errors.title}</span>}
        </label>
        <label>
          Slug (URL)
          <input value={f.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="zagolovok-stati" />
          {state.errors.slug && <span className="field-error">{state.errors.slug}</span>}
        </label>
        <label>
          Краткое описание
          <textarea rows={2} value={f.excerpt} onChange={(e) => setField("excerpt", e.target.value)} />
        </label>
        <label>
          Обложка (PNG)
          <CoverUpload value={f.coverImage} onChange={(url) => setField("coverImage", url)} />
        </label>
        <label>
          Превью для Telegram (картинка слева, справа — место под заголовок)
          <CoverUpload value={f.tgCoverImage} onChange={(url) => setField("tgCoverImage", url)} />
        </label>

        <label>Теги</label>
        {tagOptions.length === 0 ? (
          <span className="muted">Тегов пока нет — добавьте их на главной странице.</span>
        ) : (
          <div className="tag-pick">
            {tagOptions.map((name) => (
              <button
                type="button"
                key={name}
                className={state.tags.includes(name) ? "tag-chip on" : "tag-chip"}
                onClick={() => toggleTag(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <label>Контент</label>
        <Editor value={f.contentHtml} onChange={(html) => setField("contentHtml", html)} />

        <fieldset className="seo">
          <legend>SEO</legend>
          <label>
            meta title
            <input value={f.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)} />
          </label>
          <label>
            meta description
            <textarea rows={2} value={f.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)} />
          </label>
          <label>
            meta keywords
            <input value={f.metaKeywords} onChange={(e) => setField("metaKeywords", e.target.value)} />
          </label>
          <label>
            OG image (URL)
            <input value={f.ogImage} onChange={(e) => setField("ogImage", e.target.value)} />
          </label>
        </fieldset>

        <div className="actions">
          <button className="primary" disabled={state.isSaving} onClick={submit}>
            {state.isSaving ? "Сохраняем…" : "Сохранить"}
          </button>
          <Link className="btn" href="/">Отмена</Link>
        </div>
      </div>
    </div>
  );
}
