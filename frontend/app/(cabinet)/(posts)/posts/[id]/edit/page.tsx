import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/source/widgets/posts/editor";
import { PostAccess } from "@/source/widgets/posts/layout";

export const metadata: Metadata = {
  title: "Редактирование публикации",
  robots: { index: false, follow: false },
};

/** Открывает редактор выбранной публикации. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  return (
    <PostAccess>
      <PostEditor postId={id} />
    </PostAccess>
  );
}
