import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostCommentsOnServer } from "@/entities/post/server";
import { PostDetail } from "@/widgets/posts";
import { loadPostFromParams } from "../../../../content/load-post-page";
import type { PostPageProps } from "../../../../content/load-post-page";
import { createPostMetadata } from "../../../../seo/post";
import { PostJsonLd } from "../../../../ui/seo/post-json-ld";

export const dynamic = "force-dynamic";

/** Метаданные публикации; черновики и скрытые записи не индексируются. */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await loadPostFromParams(params);

  return createPostMetadata(post);
}

/** Публикация с обсуждением; черновик видит только автор. */
export default async function PostPage({ params }: PostPageProps) {
  const post = await loadPostFromParams(params);

  if (!post) {
    notFound();
  }

  const isPublished = post.status === "published";
  const comments = isPublished ? await getPostCommentsOnServer(post.id) : null;

  return (
    <>
      <PostJsonLd post={post} />
      <PostDetail
        post={post}
        comments={comments}
      />
    </>
  );
}
