import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadPostsFeed } from "@/source/entities/posts/server";
import {
  postFeedUrl,
  readPostFeedPage,
  type PostFeedParams,
} from "@/source/entities/posts/lib/postFeedPage";
import { PostsFeed } from "@/source/widgets/posts/feed";
import { PostsSkeleton } from "@/source/widgets/posts/skeleton";
import { PostList } from "@/source/widgets/posts/list/PostList";
import Button from "@/source/shared/ui/Button";
import s from "@/source/widgets/posts/posts.module.scss";

interface PageProps {
  searchParams: Promise<PostFeedParams>;
}

/** Задаёт отдельный адрес для каждой страницы ленты и каждого автора. */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { authorId, page } = readPostFeedPage(await searchParams);
  let title = authorId ? "Публикации автора" : "Публикации сообщества";
  if (page > 1) title += ` — страница ${page}`;
  const description = "Опыт, новости и публикации специалистов Ресурс-Плюс.";
  const url = postFeedUrl(page, authorId);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: ["/og-default.png"],
    },
  };
}

interface FeedContentProps {
  authorId?: number;
  page: number;
}

/** Загружает только список публикаций и ссылки на соседние страницы. */
async function FeedContent({ authorId, page }: FeedContentProps) {
  const offset = (page - 1) * 20;
  const initial = await loadPostsFeed(offset, authorId);
  if (initial && page > 1 && initial.items.length === 0) notFound();
  const hasNextPage = initial && offset + initial.items.length < initial.total;

  return (
    <>
      <PostList
        query={{ mode: authorId ? "author" : "all", authorId }}
        initial={initial}
        offset={offset}
        emptyTitle="Публикаций пока нет"
        emptyText="Поделитесь опытом, новостями и полезными материалами."
      />
      {(page > 1 || hasNextPage) && (
        <nav className={s.head} aria-label="Страницы публикаций">
          {page > 1 && (
            <Button href={postFeedUrl(page - 1, authorId)} variant="transparent">
              Предыдущая страница
            </Button>
          )}
          {hasNextPage && (
            <Button href={postFeedUrl(page + 1, authorId)} variant="transparent">
              Следующая страница
            </Button>
          )}
        </nav>
      )}
    </>
  );
}

/** Сохраняет заголовок и вкладки на экране во время загрузки публикаций. */
export default async function PostsPage({ searchParams }: PageProps) {
  const { authorId, page } = readPostFeedPage(await searchParams);

  return (
    <PostsFeed key={`${authorId ?? "all"}-${page}`} authorId={authorId}>
      <Suspense fallback={<PostsSkeleton />}>
        <FeedContent authorId={authorId} page={page} />
      </Suspense>
    </PostsFeed>
  );
}
