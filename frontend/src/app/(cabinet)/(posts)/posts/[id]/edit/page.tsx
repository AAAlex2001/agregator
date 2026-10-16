import { notFound } from "next/navigation";
import { PostAccess, PostEditor } from "@/widgets/posts";
import { loadPostFromParams } from "../../../../../content/load-post-page";
import type { PostPageProps } from "../../../../../content/load-post-page";
import { createPrivateMetadata } from "../../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Редактирование публикации");

/** Правка своей публикации: пост загружается до открытия формы. */
export default async function EditPostPage({ params }: PostPageProps) {
  const post = await loadPostFromParams(params);

  if (!post) {
    notFound();
  }

  return (
    <PostAccess>
      <PostEditor post={post} />
    </PostAccess>
  );
}
