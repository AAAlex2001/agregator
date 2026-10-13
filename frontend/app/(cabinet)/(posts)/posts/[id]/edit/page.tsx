import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPost } from "@/source/entities/posts/server";
import { PostEditor } from "@/source/widgets/posts/editor";
import { PostAccess } from "@/source/widgets/posts/layout";

export const metadata: Metadata = { title: "Редактирование публикации", robots: { index: false, follow: false } };

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

/** Правка своей публикации: пост загружается до открытия формы. */
export default async function EditPostPage({ params }: EditPostPageProps) {
  const id = Number((await params).id);
  const post = Number.isSafeInteger(id) && id > 0 ? await loadPost(id) : null;
  if (!post) notFound();

  return (
    <PostAccess>
      <PostEditor post={post} />
    </PostAccess>
  );
}
