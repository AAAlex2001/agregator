import type { Metadata } from "next";
import { nextPostListUrl, readPage } from "@/source/entities/posts";
import { loadPosts } from "@/source/entities/posts/server";
import { PostsSignIn } from "@/source/widgets/posts/layout";
import { MyReposts } from "@/source/widgets/posts/reposts";

export const metadata: Metadata = {
  title: "Мои репосты",
  robots: { index: false, follow: false },
};

interface RepostsPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Свои репосты, новые первыми. */
export default async function RepostsPage({ searchParams }: RepostsPageProps) {
  const page = readPage((await searchParams).page);
  const list = await loadPosts("/posts/reposts", page);
  if (!list) {
    return <PostsSignIn />;
  }

  return (
    <MyReposts
      posts={list.items}
      nextPageHref={nextPostListUrl(list, page, "/posts/reposts")}
    />
  );
}
