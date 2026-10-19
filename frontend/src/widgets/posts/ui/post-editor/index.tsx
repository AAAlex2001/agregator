"use client";

import type { Post } from "@/entities/post";
import { useUser } from "@/entities/user";
import { PostForm } from "@/features/write-post";
import type { PostTarget } from "@/features/write-post";
import { Button } from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Своя публикация для правки и куда пишется новый пост. */
interface PostEditorProps {
  post?: Post;
  target?: PostTarget;
}

/** Заголовок и подзаголовок экрана для поста в Telegram или на сайт. */
function editorTexts(target: PostTarget, isNew: boolean) {
  if (target === "telegram") {
    return {
      title: isNew ? "Пост в Telegram" : "Изменить пост в Telegram",
      subtitle: "Выберите каналы и группы — бот опубликует пост от вашего имени. Можно сразу и в ленту сайта.",
    };
  }

  return {
    title: isNew ? "Пост на сайт" : "Изменить публикацию",
    subtitle: "Поделитесь опытом, новостью или полезным материалом — добавьте текст, фото и видео.",
  };
}

/** Пост выходил в Telegram или идёт только туда — правим его в Telegram-редакторе. */
function postTarget(post: Post): PostTarget {
  return post.deliveries.length > 0 || !post.on_site ? "telegram" : "site";
}

/** Экран нового поста или правки своего; пост для правки приходит с сервера. */
export function PostEditor({ post, target = "site" }: PostEditorProps) {
  const { user } = useUser();
  const isForeign = post !== undefined && post.author.id !== user?.id;
  const isRepost = Boolean(post?.repost_of);
  const canEdit = !isForeign && !isRepost;
  const formTarget = post ? postTarget(post) : target;
  const texts = editorTexts(formTarget, post === undefined);

  return (
    <div className={styles.page}>
      <Button
        href="/posts/my"
        variant="transparent"
      >
        <ArrowLeftIcon />
        Мои посты
      </Button>
      <div className={styles.head}>
        <Title
          as="h1"
          text={texts.title}
        />
        <Subtitle
          text={texts.subtitle}
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
      {canEdit && (
        <PostForm
          post={post}
          target={formTarget}
        />
      )}
    </div>
  );
}
