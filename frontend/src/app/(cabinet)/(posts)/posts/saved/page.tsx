import { getPostsOnServer } from "@/entities/post/server";
import { PostList, PostsSection, PostsSignIn } from "@/widgets/posts";
import {
  hasNextPostListPage,
  readPostListPage,
} from "../../../../content/post-list-page";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Сохранённые публикации");

/** Количество серверных страниц списка из адреса. */
interface SavedPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Сохранённые публикации, недавно сохранённые первыми. */
export default async function SavedPage({ searchParams }: SavedPageProps) {
  const params = await searchParams;
  const page = readPostListPage(params.page);
  const list = await getPostsOnServer("/posts/saved", page);

  if (!list) {
    return <PostsSignIn />;
  }

  const nextPageHref = hasNextPostListPage(list, page)
    ? `/posts/saved?page=${page + 1}`
    : undefined;

  return (
    <PostsSection
      title="Сохранённое"
      subtitle="Публикации, которые вы сохранили, чтобы вернуться к ним позже."
    >
      <PostList
        posts={list.items}
        nextPageHref={nextPageHref}
        emptyTitle="Сохранённых публикаций нет"
        emptyText="Нажмите на закладку под постом, чтобы он появился здесь."
        emptyActionLabel="Перейти в ленту"
        emptyActionHref="/posts"
      />
    </PostsSection>
  );
}
