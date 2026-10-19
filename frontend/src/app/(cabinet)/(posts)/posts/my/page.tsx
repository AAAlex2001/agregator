import type { PostStatus } from "@/entities/post";
import { getPostsOnServer } from "@/entities/post/server";
import { MyPostGrid, MyPosts, PostsSignIn } from "@/widgets/posts";
import {
  hasNextPostListPage,
  readPostListPage,
} from "../../../../content/post-list-page";
import { createPrivateMetadata } from "../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Мои посты");

/** Вкладки своих постов, которые можно открыть из адреса. */
const MY_POST_STATUSES: PostStatus[] = ["published", "draft", "hidden"];

/** Вкладка и количество серверных страниц из адреса. */
interface MyPostsPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

/** Свои посты карточками; вкладка — из адреса (?status=draft после сохранения черновика). */
export default async function MyPostsPage({ searchParams }: MyPostsPageProps) {
  const params = await searchParams;
  const status = MY_POST_STATUSES.find((item) => item === params.status) ?? "published";
  const page = readPostListPage(params.page);
  const list = await getPostsOnServer("/posts/my", page, status);

  if (!list) {
    return <PostsSignIn />;
  }

  const nextPageHref = hasNextPostListPage(list, page)
    ? `/posts/my?status=${status}&page=${page + 1}`
    : undefined;

  return (
    <MyPosts status={status}>
      <MyPostGrid
        posts={list.items}
        nextPageHref={nextPageHref}
      />
    </MyPosts>
  );
}
