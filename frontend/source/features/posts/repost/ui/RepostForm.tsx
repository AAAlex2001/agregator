"use client";

import { OriginalPost, PostHead, type Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import Button from "@/source/shared/ui/Button";
import { RichTextEditor } from "@/source/shared/ui/RichTextEditor";
import { useRepostForm } from "../model/useRepostForm";
import s from "./RepostForm.module.scss";

interface RepostFormProps {
  post: Post;
}

/** Комментарий к репосту и исходная публикация под ним. */
export function RepostForm({ post }: RepostFormProps) {
  const { user } = useSession();
  const form = useRepostForm(post.id);

  return (
    <form
      className={s.form}
      onSubmit={(event) => {
        event.preventDefault();
        void form.publish();
      }}
    >
      {user && (
        <PostHead
          author={{
            id: user.id,
            name: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Пользователь",
            avatar_url: user.avatar_url,
          }}
        />
      )}
      <RichTextEditor
        ariaLabel="Комментарий к репосту"
        placeholder="Добавьте комментарий к репосту"
        defaultValue=""
        disabled={form.isSending}
        onChange={form.setHtml}
      />
      <OriginalPost post={post.repost_of ?? post} />
      <p className={s.hint}>Репост появится в ленте и во вкладке «Репосты».</p>
      <div className={s.actions}>
        <Button variant="transparent" href="/posts" disabled={form.isSending}>
          Отмена
        </Button>
        <Button type="submit" isLoading={form.isSending}>
          Опубликовать
        </Button>
      </div>
    </form>
  );
}
