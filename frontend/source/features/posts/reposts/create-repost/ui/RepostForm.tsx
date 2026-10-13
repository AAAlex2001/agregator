"use client";

import { OriginalPost, PostHead, type Post } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import Button from "@/source/shared/ui/Button";
import { PostRichEditor } from "@/source/features/posts/editor";
import { useRepostForm } from "../model/useRepostForm";
import s from "./RepostForm.module.scss";

/** Комментарий к репосту и предпросмотр исходной публикации. */
export function RepostForm({ post }: { post: Post }) {
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
            name:
              [user.first_name, user.last_name].filter(Boolean).join(" ") ||
              "Пользователь",
            avatar_url: user.avatar_url,
          }}
        />
      )}
      <PostRichEditor
        ariaLabel="Комментарий к репосту"
        placeholder="Добавьте комментарий к репосту"
        value={form.html}
        disabled={form.pending}
        onChange={form.setHtml}
      />
      <OriginalPost post={post.repost_of ?? post} />
      <p className={s.hint}>Репост появится в ленте и во вкладке «Репосты».</p>
      {form.error && (
        <p className={s.error} role="alert">
          {form.error}
        </p>
      )}
      <div className={s.actions}>
        <Button variant="transparent" href="/posts" disabled={form.pending}>
          Отмена
        </Button>
        <Button type="submit" isLoading={form.pending}>
          Опубликовать
        </Button>
      </div>
    </form>
  );
}
