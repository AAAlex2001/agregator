import { ArticleIn, ArticleListItem, ArticleOut } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const listArticles = async (params: {
  kind?: string;
  status?: string;
}): Promise<{ items: ArticleListItem[]; total: number }> => {
  const qs = new URLSearchParams();
  if (params.kind) qs.set("kind", params.kind);
  if (params.status) qs.set("status", params.status);

  const response = await fetch(`${base}/api/articles?${qs.toString()}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить список");

  const data = await response.json();
  return {
    total: data.total,
    items: data.items.map((a: any) => ({
      id: a.id,
      kind: a.kind,
      status: a.status,
      title: a.title,
      slug: a.slug,
      publishedAt: a.published_at,
      updatedAt: a.updated_at,
    })),
  };
};

export const loadArticle = async (id: number): Promise<ArticleIn> => {
  const response = await fetch(`${base}/api/articles/${id}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить статью");

  const a = await response.json();
  return {
    id: a.id,
    kind: a.kind,
    status: a.status,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImage: a.cover_image,
    tags: a.tags,
    contentHtml: a.content_html,
    metaTitle: a.meta_title,
    metaDescription: a.meta_description,
    metaKeywords: a.meta_keywords,
    ogImage: a.og_image,
    publishedAt: a.published_at,
  };
};

export const saveArticle = async (id: number | null, article: ArticleOut) => {
  const response = await fetch(id ? `${base}/api/articles/${id}` : `${base}/api/articles`, {
    method: id ? "PUT" : "POST",
    body: JSON.stringify({
      kind: article.kind,
      status: article.status,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      tags: article.tags,
      content_html: article.contentHtml,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      meta_keywords: article.metaKeywords,
      og_image: article.ogImage,
      published_at: article.publishedAt,
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (response.status === 409) throw new Error("Такой slug уже занят");
  if (!response.ok) throw new Error("Не удалось сохранить статью");
  return response.json();
};

export const deleteArticle = async (id: number) => {
  const response = await fetch(`${base}/api/articles/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Не удалось удалить статью");
};

export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${base}/api/upload`, { method: "POST", body: form });
  if (!response.ok) throw new Error("Не удалось загрузить картинку");
  const data = await response.json();
  return data.url;
};

export const logout = async () => {
  await fetch(`${base}/api/logout`, { method: "POST" });
};
