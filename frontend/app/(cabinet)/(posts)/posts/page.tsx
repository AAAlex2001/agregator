import type { Metadata } from "next";
import {
  FeedJsonLd,
  nextPostListUrl,
  postListUrl,
  readPage,
  type PostPage,
} from "@/source/entities/posts";
import { loadFollowingUnseen, loadPosts } from "@/source/entities/posts/server";
import { PostsFeed } from "@/source/widgets/posts/feed";
import { PostList } from "@/source/widgets/posts/list";

interface FeedParams {
  author?: string;
  page?: string;
}

interface PostsPageProps {
  searchParams: Promise<FeedParams>;
}

const DESCRIPTION =
  "Опыт, новости и публикации специалистов промышленной безопасности на Ресурс-Плюс.";

/** Лента из адреса: ?author=12 — лента автора, ?page=3 — первые три страницы. */
function readFeed(params: FeedParams) {
  const authorId = Number(params.author) || undefined;
  const page = readPage(params.page);
  const path = authorId ? `/posts/author/${authorId}` : "/posts/feed";
  const query: Record<string, string> = authorId ? { author: String(authorId) } : {};

  return { authorId, page, path, query };
}

/** Заголовок ленты; у ленты автора — с его именем. */
function feedTitle(feed: PostPage | null, authorId: number | undefined): string {
  if (!authorId) {
    return "Публикации сообщества";
  }

  const authorName = feed?.items[0]?.author.name;
  return authorName ? `Публикации: ${authorName}` : "Публикации автора";
}

/** Страницы «Показать ещё» дополняют первую, поэтому адрес у ленты один. */
export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const { authorId, page, path, query } = readFeed(await searchParams);
  const feed = await loadPosts(path, page);
  const title = feedTitle(feed, authorId);
  const url = postListUrl("/posts", 1, query);

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

/** Лента и лента автора: публикации с первой по текущую страницу сразу в разметке. */
export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { authorId, page, path, query } = readFeed(await searchParams);
  const feed = await loadPosts(path, page);
  const unseenCount = await loadFollowingUnseen();
  if (!feed) {
    return null;
  }

  const title = feedTitle(feed, authorId);

  return (
    <PostsFeed
      title={authorId ? title : "Лента"}
      tab="all"
      authorId={authorId}
      unseenCount={unseenCount}
    >
      <FeedJsonLd
        title={title}
        path={postListUrl("/posts", 1, query)}
        posts={feed.items}
      />
      <PostList
        posts={feed.items}
        nextPageHref={nextPostListUrl(feed, page, "/posts", query)}
        emptyTitle="Публикаций пока нет"
        emptyText="Поделитесь опытом, новостями и полезными материалами."
        emptyActionLabel="Написать пост"
        emptyActionHref="/posts/new"
      />
    </PostsFeed>
  );
}
