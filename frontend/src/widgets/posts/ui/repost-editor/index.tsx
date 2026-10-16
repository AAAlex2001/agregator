import type { Post } from "@/entities/post";
import { RepostForm } from "@/features/repost-post";
import { Button } from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Публикация, которой делятся; приходит с сервера. */
interface RepostEditorProps {
  post: Post;
}

/** Экран репоста с комментарием; неопубликованной записью поделиться нельзя. */
export function RepostEditor({ post }: RepostEditorProps) {
  return (
    <div className={styles.page}>
      <Button
        href="/posts"
        variant="transparent"
      >
        <ArrowLeftIcon />
        Назад в ленту
      </Button>
      <div className={styles.head}>
        <Title
          as="h1"
          text="Репост с комментарием"
        />
        <Subtitle
          text="Добавьте свой комментарий и поделитесь публикацией в ленте."
          className={styles.subtitle}
        />
      </div>
      {post.status === "published" ? (
        <RepostForm post={post} />
      ) : (
        <p className={styles.notice}>Репост доступен после публикации.</p>
      )}
    </div>
  );
}
