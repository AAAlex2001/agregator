import { getPostsOnServer } from "@/entities/post/server";
import { PostList, PostsFeed, PostsSignIn } from "@/widgets/posts";
import {
  hasNextPostListPage,
  readPostListPage,
} from "../../../../content/post-list-page";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Подписки");

/** Количество серверных страниц ленты из адреса. */
interface FollowingPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Лента «Подписки»; её загрузка обнуляет счётчик новых публикаций. */
export default async function FollowingPage({ searchParams }: FollowingPageProps) {
  const params = await searchParams;
  const page = readPostListPage(params.page);
  const feed = await getPostsOnServer("/posts/feed/following", page);

  if (!feed) {
    return <PostsSignIn />;
  }

  const nextPageHref = hasNextPostListPage(feed, page)
    ? `/posts/following?page=${page + 1}`
    : undefined;

  return (
    <PostsFeed
      title="Лента"
      tab="following"
      unseenCount={0}
    >
      <PostList
        posts={feed.items}
        nextPageHref={nextPageHref}
        emptyTitle="В подписках пока пусто"
        emptyText="Подпишитесь на интересных авторов через меню публикации."
        emptyActionLabel="Перейти в ленту"
        emptyActionHref="/posts"
      />
    </PostsFeed>
  );
}
