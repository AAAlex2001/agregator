import { notFound } from "next/navigation";
import { PostAccess, RepostEditor } from "@/widgets/posts";
import { loadPostFromParams } from "../../../../../content/load-post-page";
import type { PostPageProps } from "../../../../../content/load-post-page";
import { createPrivateMetadata } from "../../../../../seo/private-page";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Репост");

/** Репост с комментарием: исходная публикация загружается до открытия формы. */
export default async function RepostPage({ params }: PostPageProps) {
  const post = await loadPostFromParams(params);

  if (!post) {
    notFound();
  }

  return (
    <PostAccess>
      <RepostEditor post={post} />
    </PostAccess>
  );
}
