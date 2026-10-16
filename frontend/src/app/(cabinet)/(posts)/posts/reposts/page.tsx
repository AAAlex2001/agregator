import { getPostsOnServer } from "@/entities/post/server";
import { PostList, PostsSection, PostsSignIn } from "@/widgets/posts";
import {
  hasNextPostListPage,
  readPostListPage,
} from "../../../../content/post-list-page";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Мои репосты");

/** Количество серверных страниц списка из адреса. */
interface RepostsPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Свои репосты, новые первыми. */
export default async function RepostsPage({ searchParams }: RepostsPageProps) {
  const params = await searchParams;
  const page = readPostListPage(params.page);
  const list = await getPostsOnServer("/posts/reposts", page);

  if (!list) {
    return <PostsSignIn />;
  }

  const nextPageHref = hasNextPostListPage(list, page)
    ? `/posts/reposts?page=${page + 1}`
    : undefined;

  return (
    <PostsSection
      title="Репосты"
      subtitle="Записи, которыми вы поделились в своей ленте, с комментарием или без."
    >
      <PostList
        posts={list.items}
        nextPageHref={nextPageHref}
        emptyTitle="Репостов пока нет"
        emptyText="Нажмите на стрелки под постом, чтобы поделиться им у себя."
        emptyActionLabel="Перейти в ленту"
        emptyActionHref="/posts"
      />
    </PostsSection>
  );
}
