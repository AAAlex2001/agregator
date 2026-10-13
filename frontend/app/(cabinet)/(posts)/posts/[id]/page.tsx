import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadPost } from "@/source/entities/posts/server";
import { postMetadata } from "@/source/entities/posts/lib/postSeo";
import { PostJsonLd } from "@/source/entities/posts/ui/PostJsonLd";
import { PostDetail } from "@/source/widgets/posts/detail";
import { PostCardSkeleton } from "@/source/widgets/posts/skeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Описание опубликованного поста для поисковиков и ссылок. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) return postMetadata(null);
  return postMetadata(await loadPost(id));
}

/** Показывает пост и обсуждение; чужие черновики недоступны. */
async function PostPageContent({ params }: PageProps) {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const initialPost = await loadPost(id, true);
  if (initialPost === null) notFound();

  return (
    <>
      {initialPost && <PostJsonLd post={initialPost} />}
      <PostDetail key={id} id={id} initialPost={initialPost} />
    </>
  );
}

/** Показывает скелетон, пока загружается существующая публикация. */
export default function PostPage(props: PageProps) {
  return (
    <Suspense fallback={<PostCardSkeleton />}>
      <PostPageContent {...props} />
    </Suspense>
  );
}
