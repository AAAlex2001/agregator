import type { Metadata } from "next";
import { nextPostListUrl, readPage } from "@/source/entities/posts";
import { loadPosts } from "@/source/entities/posts/server";
import { PostsFeed } from "@/source/widgets/posts/feed";
import { PostsSignIn } from "@/source/widgets/posts/layout";
import { PostList } from "@/source/widgets/posts/list";

export const metadata: Metadata = {
  title: "Подписки",
  robots: { index: false, follow: false },
};

interface FollowingPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Лента «Подписки». Её загрузка обнуляет счётчик новых публикаций. */
export default async function FollowingPage({ searchParams }: FollowingPageProps) {
  const page = readPage((await searchParams).page);
  const feed = await loadPosts("/posts/feed/following", page);
  if (!feed) {
    return <PostsSignIn />;
  }

  return (
    <PostsFeed title="Лента" tab="following" unseenCount={0}>
      <PostList
        posts={feed.items}
        nextPageHref={nextPostListUrl(feed, page, "/posts/following")}
        emptyTitle="В подписках пока пусто"
        emptyText="Подпишитесь на интересных авторов через меню публикации."
        emptyActionLabel="Перейти в ленту"
        emptyActionHref="/posts"
      />
    </PostsFeed>
  );
}
