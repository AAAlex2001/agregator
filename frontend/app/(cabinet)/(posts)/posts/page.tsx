import type { Metadata } from "next";
import { Suspense } from "react";
import { nextPostListUrl, postListUrl, readPage } from "@/source/entities/posts";
import { loadFollowingUnseen, loadPosts } from "@/source/entities/posts/server";
import { PostsFeed } from "@/source/widgets/posts/feed";
import { PostList } from "@/source/widgets/posts/list";
import { PostsSkeleton } from "@/source/widgets/posts/skeleton";

interface PostsPageProps {
  searchParams: Promise<{ author?: string; page?: string }>;
}

const DESCRIPTION =
  "Опыт, новости и публикации специалистов промышленной безопасности на Ресурс-Плюс.";

/** Автор из адреса ленты: ?author=12 — лента автора, иначе общая. */
function authorParams(authorId: number | undefined): Record<string, string> {
  return authorId ? { author: String(authorId) } : {};
}

/** Лента и лента автора. Страницы «Показать ещё» дополняют первую, поэтому адрес у ленты один. */
export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const authorId = Number((await searchParams).author) || undefined;
  const title = authorId ? "Публикации автора" : "Публикации сообщества";
  const url = postListUrl("/posts", 1, authorParams(authorId));

  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description: DESCRIPTION,
      url,
      images: ["/og-default.png"],
    },
  };
}

interface FeedPageProps {
  page: number;
  authorId?: number;
}

/** Публикации с первой по текущую страницу сразу в разметке и ссылка на следующую. */
async function FeedPage({ page, authorId }: FeedPageProps) {
  const path = authorId ? `/posts/author/${authorId}` : "/posts/feed";
  const feed = await loadPosts(path, page);
  if (!feed) {
    return null;
  }

  return (
    <PostList
      posts={feed.items}
      nextPageHref={nextPostListUrl(feed, page, "/posts", authorParams(authorId))}
      emptyTitle="Публикаций пока нет"
      emptyText="Поделитесь опытом, новостями и полезными материалами."
      emptyActionLabel="Написать пост"
      emptyActionHref="/posts/new"
    />
  );
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const page = readPage(params.page);
  const authorId = Number(params.author) || undefined;
  const unseenCount = await loadFollowingUnseen();

  return (
    <PostsFeed tab="all" authorId={authorId} unseenCount={unseenCount}>
      <Suspense fallback={<PostsSkeleton />}>
        <FeedPage page={page} authorId={authorId} />
      </Suspense>
    </PostsFeed>
  );
}
