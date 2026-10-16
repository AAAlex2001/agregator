"use client";

import type { Post } from "@/entities/post";
import { useUser } from "@/entities/user";
import { PostForm } from "@/features/write-post";
import { Button } from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Своя публикация для правки; без неё экран создаёт новую. */
interface PostEditorProps {
  post?: Post;
}

/** Экран новой публикации или правки своей; пост для правки приходит с сервера. */
export function PostEditor({ post }: PostEditorProps) {
  const { user } = useUser();
  const isForeign = post !== undefined && post.author.id !== user?.id;
  const isRepost = Boolean(post?.repost_of);
  const canEdit = !isForeign && !isRepost;
  const title = post ? "Изменить публикацию" : "Новая публикация";
  const subtitle = post
    ? "Обновите текст и вложения, затем сохраните изменения."
    : "Поделитесь опытом, новостью или полезным материалом — добавьте текст, фото и видео.";

  return (
    <div className={styles.page}>
      <Button
        href="/posts/my"
        variant="transparent"
      >
        <ArrowLeftIcon />
        Мои публикации
      </Button>
      <div className={styles.head}>
        <Title
          as="h1"
          text={title}
        />
        <Subtitle
          text={subtitle}
          className={styles.subtitle}
        />
      </div>
      {isForeign && (
        <p className={styles.notice}>Изменять можно только свои публикации.</p>
      )}
      {isRepost && (
        <p className={styles.notice}>
          Репост нельзя изменить — его можно удалить и сделать заново.
        </p>
      )}
      {canEdit && <PostForm post={post} />}
    </div>
  );
}
