import type { Metadata } from "next";
import { nextPostListUrl, readPage } from "@/source/entities/posts";
import { loadPosts } from "@/source/entities/posts/server";
import { PostsSignIn } from "@/source/widgets/posts/layout";
import { SavedPosts } from "@/source/widgets/posts/saved";

export const metadata: Metadata = {
  title: "Сохранённые публикации",
  robots: { index: false, follow: false },
};

interface SavedPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Сохранённые публикации, недавно сохранённые первыми. */
export default async function SavedPage({ searchParams }: SavedPageProps) {
  const page = readPage((await searchParams).page);
  const list = await loadPosts("/posts/saved", page);
  if (!list) {
    return <PostsSignIn />;
  }

  return (
    <SavedPosts
      posts={list.items}
      nextPageHref={nextPostListUrl(list, page, "/posts/saved")}
    />
  );
}
