import type { Metadata } from "next";
import { Suspense } from "react";
import {
  POSTS_MAX_PAGE,
  postFeedUrl,
  readPostFeedPage,
  type PostFeedParams,
} from "@/source/entities/posts";
import { loadPostsFeed } from "@/source/entities/posts/server";
import { FeedList, PostsFeed } from "@/source/widgets/posts/feed";
import { PostsSkeleton } from "@/source/widgets/posts/skeleton";

interface PostsPageProps {
  searchParams: Promise<PostFeedParams>;
}

const DESCRIPTION =
  "Опыт, новости и публикации специалистов промышленной безопасности на Ресурс-Плюс.";

/** Лента и лента автора. Страницы «Показать ещё» дополняют первую, поэтому адрес у ленты один. */
export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const { authorId } = readPostFeedPage(await searchParams);
  const title = authorId ? "Публикации автора" : "Публикации сообщества";
  const url = postFeedUrl(1, authorId);

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
  const feed = await loadPostsFeed(page, authorId);
  const hasMore = feed.items.length < feed.total && page < POSTS_MAX_PAGE;
  const nextPageHref = hasMore ? postFeedUrl(page + 1, authorId) : undefined;

  return (
    <FeedList
      posts={feed.items}
      nextPageHref={nextPageHref}
    />
  );
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { authorId, page } = readPostFeedPage(await searchParams);

  return (
    <PostsFeed key={authorId ?? "all"} authorId={authorId}>
      <Suspense fallback={<PostsSkeleton />}>
        <FeedPage page={page} authorId={authorId} />
      </Suspense>
    </PostsFeed>
  );
}
