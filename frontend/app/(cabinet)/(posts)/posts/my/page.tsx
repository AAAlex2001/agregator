import type { Metadata } from "next";
import { nextPostListUrl, readPage, type PostStatus } from "@/source/entities/posts";
import { loadPosts } from "@/source/entities/posts/server";
import { PostsSignIn } from "@/source/widgets/posts/layout";
import { MyPosts } from "@/source/widgets/posts/my-posts";

export const metadata: Metadata = {
  title: "Мои публикации",
  robots: { index: false, follow: false },
};

const STATUSES: PostStatus[] = ["published", "draft", "hidden"];

interface MyPostsPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

/** Свои публикации; вкладка — из адреса (?status=draft после сохранения черновика). */
export default async function MyPostsPage({ searchParams }: MyPostsPageProps) {
  const params = await searchParams;
  const status = STATUSES.find((item) => item === params.status) ?? "published";
  const page = readPage(params.page);

  const list = await loadPosts("/posts/my", page, status);
  if (!list) {
    return <PostsSignIn />;
  }

  return (
    <MyPosts
      status={status}
      posts={list.items}
      nextPageHref={nextPostListUrl(list, page, "/posts/my", { status })}
    />
  );
}
