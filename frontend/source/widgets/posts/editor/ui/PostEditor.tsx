"use client";

import { ArrowLeftIcon, type Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { PostForm } from "@/source/features/posts/write-post";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./PostEditor.module.scss";

interface PostEditorProps {
  post?: Post;
}

/** Новая публикация или правка своей. Пост для правки приходит с сервера уже загруженным. */
export function PostEditor({ post }: PostEditorProps) {
  const { user } = useSession();
  const isForeign = post !== undefined && post.author.id !== user?.id;
  const isRepost = Boolean(post?.repost_of);

  return (
    <div className={s.page}>
      <Button href="/posts/my" variant="transparent">
        <ArrowLeftIcon />
        Мои публикации
      </Button>
      <div className={s.head}>
        <Title as="h1" text={post ? "Изменить публикацию" : "Новая публикация"} />
        <Subtitle
          className={s.subtitle}
          text={
            post
              ? "Обновите текст и вложения, затем сохраните изменения."
              : "Поделитесь опытом, новостью или полезным материалом — добавьте текст, фото и видео."
          }
        />
      </div>
      {isForeign && <p className={s.notice}>Изменять можно только свои публикации.</p>}
      {isRepost && <p className={s.notice}>Репост нельзя изменить — его можно удалить и сделать заново.</p>}
      {!isForeign && !isRepost && <PostForm post={post} />}
    </div>
  );
}
