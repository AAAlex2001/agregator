"use client";

import { useSession } from "@/source/entities/session";
import { usePost } from "@/source/features/posts/post/read-post";
import { PostForm } from "@/source/features/posts/my-posts/write-post";
import Button from "@/source/shared/ui/Button";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { ArrowLeftIcon } from "@/source/entities/posts/ui/icons";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { PostEditorSkeleton } from "./PostEditorSkeleton";
import s from "./PostEditor.module.scss";

/** Загружает свою публикацию перед редактированием. */
function EditPost({ postId }: { postId: number }) {
  const { user } = useSession();
  const { post, loading, error, reload } = usePost(postId);
  if (loading) return <PostEditorSkeleton />;
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
  if (post.author.id !== user?.id)
    return <p className={s.error}>Изменять можно только свои публикации.</p>;
  return <PostForm key={post.id} post={post} />;
}

/** Собирает страницу создания или редактирования публикации. */
export function PostEditor({ postId }: { postId?: number }) {
  return (
    <div className={s.page}>
      <Button href="/posts/my" variant="transparent">
        <ArrowLeftIcon />
        Мои публикации
      </Button>
      <div className={s.head}>
        <Title as="h1" text={postId ? "Изменить публикацию" : "Новая публикация"} />
        <Subtitle
          className={s.subtitle}
          text={
            postId
              ? "Обновите текст и вложения, затем сохраните изменения."
              : "Поделитесь опытом, новостью или полезным материалом — добавьте текст, фото и видео."
          }
        />
      </div>
      {postId ? <EditPost key={postId} postId={postId} /> : <PostForm />}
    </div>
  );
}
