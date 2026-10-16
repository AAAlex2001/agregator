import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const url = specifier.startsWith(".") && context.parentURL
      ? new URL(`${specifier}.ts`, context.parentURL)
      : null;

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { createArticleMetadata } = await import("./article.ts");
const { extractArticleFaq } = await import("./article-faq.ts");

/** Статья с отдельными поисковыми текстами и двумя видами обложки. */
const article = {
  kind: "news",
  slug: "canonical-slug",
  title: "Заголовок статьи",
  excerpt: "Краткое описание",
  meta_title: "Поисковый заголовок",
  meta_description: "Поисковое описание",
  meta_keywords: "Промышленность",
  cover_image: "/cover.jpg",
  og_image: "/social.jpg",
  published_at: "2026-10-15T12:00:00Z",
  updated_at: "2026-10-16T12:00:00Z",
  tags: ["Тег один", "Тег два"],
};

test("article metadata keeps the API slug, search fields and publication dates", () => {
  const metadata = createArticleMetadata("news", article);

  assert.equal(metadata.title, article.meta_title);
  assert.equal(metadata.description, article.meta_description);
  assert.equal(metadata.keywords, article.meta_keywords);
  assert.equal(metadata.alternates.canonical, "/news/canonical-slug");
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.openGraph.publishedTime, article.published_at);
  assert.equal(metadata.openGraph.modifiedTime, article.updated_at);
  assert.equal(metadata.robots.index, true);
});

test("news and blog retain their different image fallback rules", () => {
  assert.equal(
    createArticleMetadata("news", article).openGraph.images[0].url,
    "/social.jpg",
  );
  assert.equal(
    createArticleMetadata("blog", { ...article, kind: "blog" })
      .openGraph.images[0].url,
    "/cover.jpg",
  );
  const withoutImages = { ...article, og_image: "", cover_image: "" };
  assert.deepEqual(
    createArticleMetadata("news", withoutImages).twitter.images,
    ["/og-default.png"],
  );
});

test("empty SEO fields use article content while missing or wrong sections stay noindex", () => {
  const metadata = createArticleMetadata("news", {
    ...article,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    published_at: null,
  });

  assert.equal(metadata.title, article.title);
  assert.equal(metadata.description, article.excerpt);
  assert.equal(metadata.keywords, article.tags.join(", "));
  assert.equal(metadata.openGraph.publishedTime, undefined);
  assert.equal(createArticleMetadata("blog", article).robots.index, false);
  assert.equal(createArticleMetadata("news", null).robots.index, false);
});

test("FAQ requires three questions with sufficiently long answers", () => {
  const answer = "Подробный ответ. ".repeat(12);
  const section = `<h2>Как это работает?</h2><p>${answer}</p>`;

  assert.deepEqual(extractArticleFaq(section.repeat(2)), []);
  assert.equal(extractArticleFaq(section.repeat(3)).length, 3);
  assert.deepEqual(
    extractArticleFaq("<h2>Вопрос?</h2><p>Короткий ответ</p>".repeat(3)),
    [],
  );
  assert.deepEqual(
    extractArticleFaq(`<h2>Заголовок без вопроса</h2><p>${answer}</p>`.repeat(3)),
    [],
  );
});

test("FAQ removes markup, decodes known entities and limits long answers", () => {
  const section = `<h2>Что значит &laquo;текст&raquo;?</h2><p>${"А".repeat(950)}</p>`;
  const entries = extractArticleFaq(section.repeat(3));

  assert.equal(entries[0].question, "Что значит «текст»?");
  assert.equal(entries[0].answer.length, 900);
  assert.equal(entries[0].answer.includes("<p>"), false);
});
