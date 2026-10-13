import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { postMetadata, PostJsonLd } from "@/source/entities/posts";
import { loadPost, loadThreads } from "@/source/entities/posts/server";
import { PostDetail } from "@/source/widgets/posts/detail";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

/** Номер публикации из адреса или null, если это не номер. */
async function postId(params: PostPageProps["params"]): Promise<number | null> {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const isValid = Number.isSafeInteger(id) && id > 0;

  return isValid ? id : null;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const id = await postId(params);
  const post = id ? await loadPost(id) : null;

  return postMetadata(post);
}

/** Публикация с обсуждением; черновик видит только автор. */
export default async function PostPage({ params }: PostPageProps) {
  const id = await postId(params);
  const post = id ? await loadPost(id) : null;
  if (!post) {
    notFound();
  }

  const isPublished = post.status === "published";
  const threads = isPublished ? await loadThreads(post.id) : null;

  return (
    <>
      <PostJsonLd post={post} />
      <PostDetail post={post} threads={threads} />
    </>
  );
}
