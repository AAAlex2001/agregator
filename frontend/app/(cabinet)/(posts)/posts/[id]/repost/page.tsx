import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPost } from "@/source/entities/posts/server";
import { PostAccess } from "@/source/widgets/posts/layout";
import { RepostEditor } from "@/source/widgets/posts/repost-editor";

export const metadata: Metadata = {
  title: "Репост",
  robots: { index: false, follow: false },
};

interface RepostPageProps {
  params: Promise<{ id: string }>;
}

/** Репост с комментарием: исходная публикация загружается до открытия формы. */
export default async function RepostPage({ params }: RepostPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const isValidId = Number.isSafeInteger(id) && id > 0;
  const post = isValidId ? await loadPost(id) : null;
  if (!post) {
    notFound();
  }

  return (
    <PostAccess>
      <RepostEditor post={post} />
    </PostAccess>
  );
}
