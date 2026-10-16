"use client";

import { OriginalPost } from "@/entities/post";
import type { Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { RichTextEditor } from "@/shared/ui/rich-text-editor";
import { useRepostForm } from "../../model/use-repost-form";
import styles from "./style.module.scss";

/** Публикация, которой делятся. */
interface RepostFormProps {
  post: Post;
}

/** Комментарий к репосту и исходная публикация под ним. */
export function RepostForm({ post }: RepostFormProps) {
  const {
    isSending,
    setHtml,
    publish,
  } = useRepostForm(post.id);
  const original = post.repost_of ?? post;

  return (
    <form
      className={styles.form}
      onSubmit={publish}
    >
      <RichTextEditor
        ariaLabel="Комментарий к репосту"
        placeholder="Добавьте комментарий к репосту"
        defaultValue=""
        disabled={isSending}
        onChange={setHtml}
      />
      <OriginalPost post={original} />
      <p className={styles.hint}>Репост появится в ленте и во вкладке «Репосты».</p>
      <div className={styles.actions}>
        <Button
          variant="transparent"
          href="/posts"
          disabled={isSending}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          isLoading={isSending}
        >
          Опубликовать
        </Button>
      </div>
    </form>
  );
}
