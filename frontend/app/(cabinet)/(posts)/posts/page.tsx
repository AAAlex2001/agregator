import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { POSTS_PAGE_SIZE, postFeedUrl, readPostFeedPage, type PostFeedParams } from "@/source/entities/posts";
import { loadPostsFeed } from "@/source/entities/posts/server";
import { FeedList, FeedPagination, PostsFeed } from "@/source/widgets/posts/feed";
import { PostsSkeleton } from "@/source/widgets/posts/skeleton";

interface PostsPageProps {
  searchParams: Promise<PostFeedParams>;
}

/** У каждой страницы ленты и ленты автора свой адрес и заголовок. */
export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const { authorId, page } = readPostFeedPage(await searchParams);
  const base = authorId ? "Публикации автора" : "Публикации сообщества";
  const title = page > 1 ? `${base} — страница ${page}` : base;
  const description = "Опыт, новости и публикации специалистов промышленной безопасности на Ресурс-Плюс.";
  const url = postFeedUrl(page, authorId);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, type: "website", url, images: ["/og-default.png"] },
  };
}

interface FeedPageProps {
  page: number;
  authorId?: number;
}

/** Страница ленты с сервера: публикации сразу в разметке и ссылки на соседние страницы. */
async function FeedPage({ page, authorId }: FeedPageProps) {
  const feed = await loadPostsFeed(page, authorId);
  if (page > 1 && feed.items.length === 0) notFound();

  return (
    <>
      <FeedList posts={feed.items} />
      <FeedPagination page={page} pages={Math.ceil(feed.total / POSTS_PAGE_SIZE)} authorId={authorId} />
    </>
  );
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { authorId, page } = readPostFeedPage(await searchParams);

  return (
    <PostsFeed key={`${authorId ?? "all"}-${page}`} authorId={authorId}>
      <Suspense fallback={<PostsSkeleton />}>
        <FeedPage page={page} authorId={authorId} />
      </Suspense>
    </PostsFeed>
  );
}
