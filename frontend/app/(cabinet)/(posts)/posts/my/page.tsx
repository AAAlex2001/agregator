import type { Metadata } from "next";
import type { PostStatus } from "@/source/entities/posts";
import { PostAccess } from "@/source/widgets/posts/layout";
import { MyPosts } from "@/source/widgets/posts/my-posts";

export const metadata: Metadata = { title: "Мои публикации", robots: { index: false, follow: false } };

const STATUSES: PostStatus[] = ["published", "draft", "hidden"];

interface MyPostsPageProps {
  searchParams: Promise<{ status?: string }>;
}

/** Свои публикации; вкладка открывается из адреса (?status=draft после сохранения черновика). */
export default async function MyPostsPage({ searchParams }: MyPostsPageProps) {
  const requested = (await searchParams).status;
  const status = STATUSES.find((item) => item === requested) ?? "published";

  return (
    <PostAccess>
      <MyPosts key={status} initialStatus={status} />
    </PostAccess>
  );
}
