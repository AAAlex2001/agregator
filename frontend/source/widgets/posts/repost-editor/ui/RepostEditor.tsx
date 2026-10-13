"use client";

import { usePost } from "@/source/features/posts/post/read-post";
import { RepostForm } from "@/source/features/posts/reposts/create-repost";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { ArrowLeftIcon } from "@/source/entities/posts/ui/icons";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { PostCardSkeleton } from "@/source/widgets/posts/skeleton";
import s from "./RepostEditor.module.scss";

/** Загружает исходный пост перед открытием формы. */
function RepostContent({ postId }: { postId: number }) {
  const { post, loading, error, reload } = usePost(postId);

  if (loading) return <PostCardSkeleton />;
  if (error) {
    return (
      <div className={s.loadError} role="alert">
        <EmptyState
          title="Ошибка загрузки"
          subtitle={error}
          actionLabel="Повторить"
          onAction={reload}
        />
      </div>
    );
  }
  if (!post) return null;
  if (post.status !== "published") {
    return <p className={s.error}>Репост доступен после публикации.</p>;
  }

  return <RepostForm post={post} />;
}

/** Страница репоста с комментарием. */
export function RepostEditor({ postId }: { postId: number }) {
  return (
    <div className={s.page}>
      <Button href="/posts" variant="transparent">
        <ArrowLeftIcon />
        Назад в ленту
      </Button>
      <div className={s.head}>
        <Title as="h1" text="Репост с комментарием" />
        <Subtitle className={s.subtitle} text="Добавьте свой комментарий и поделитесь публикацией в ленте." />
      </div>
      <RepostContent key={postId} postId={postId} />
    </div>
  );
}
