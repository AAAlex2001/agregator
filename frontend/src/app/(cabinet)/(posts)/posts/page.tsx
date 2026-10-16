import type { Metadata } from "next";
import {
  getFollowingUnseenOnServer,
  getPostsOnServer,
} from "@/entities/post/server";
import { PostList, PostsFeed } from "@/widgets/posts";
import { hasNextPostListPage } from "../../../content/post-list-page";
import {
  getPostsFeedTitle,
  readPostsFeed,
} from "../../../content/posts-feed-query";
import type { PostsFeedPageProps } from "../../../content/posts-feed-query";
import { createPostsFeedMetadata } from "../../../seo/posts-feed";
import { PostsFeedJsonLd } from "../../../ui/seo/posts-feed-json-ld";

export const dynamic = "force-dynamic";

/** Метаданные ленты или ленты автора с адресом без номера страницы. */
export async function generateMetadata({
  searchParams,
}: PostsFeedPageProps): Promise<Metadata> {
  const { authorId, page, apiPath, path } = readPostsFeed(await searchParams);
  const feed = await getPostsOnServer(apiPath, page);

  return createPostsFeedMetadata(getPostsFeedTitle(feed, authorId), path);
}

/** Лента и лента автора: публикации с первой по текущую страницу сразу в разметке. */
export default async function PostsPage({ searchParams }: PostsFeedPageProps) {
  const {
    authorId,
    page,
    apiPath,
    path,
    nextPageHref,
  } = readPostsFeed(await searchParams);
  const [feed, unseenCount] = await Promise.all([
    getPostsOnServer(apiPath, page),
    getFollowingUnseenOnServer(),
  ]);

  if (!feed) {
    return null;
  }

  const title = getPostsFeedTitle(feed, authorId);
  const heading = authorId ? title : "Лента";
  const loadMoreHref = hasNextPostListPage(feed, page) ? nextPageHref : undefined;

  return (
    <PostsFeed
      title={heading}
      tab="all"
      authorId={authorId}
      unseenCount={unseenCount}
    >
      <PostsFeedJsonLd
        title={title}
        path={path}
        posts={feed.items}
      />
      <PostList
        posts={feed.items}
        nextPageHref={loadMoreHref}
        emptyTitle="Публикаций пока нет"
        emptyText="Поделитесь опытом, новостями и полезными материалами."
        emptyActionLabel="Написать пост"
        emptyActionHref="/posts/new"
      />
    </PostsFeed>
  );
}
