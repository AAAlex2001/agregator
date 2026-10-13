"use client";

import type { PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Button from "@/source/shared/ui/Button";
import { TextArea } from "@/source/shared/ui/Inputs";
import { useCommentForm } from "../model/useCommentForm";
import s from "./comments.module.scss";

const MAX_COMMENT_LENGTH = 2000;

interface CommentFormProps {
  postId: number;
  comment?: PostComment;
  replyTo?: PostComment;
  onSaved: () => void;
  onCancel?: () => void;
}

/** Форма комментария, ответа или правки. Гостю вместо формы — предложение войти. */
export function CommentForm({ postId, comment, replyTo, onSaved, onCancel }: CommentFormProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const form = useCommentForm({ postId, comment, replyTo, onSaved });

  if (!user) {
    return (
      <div className={s.guest}>
        <p>Войдите, чтобы участвовать в обсуждении.</p>
        <Button variant="outline" onClick={() => openAuth("login")}>
          Войти
        </Button>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={form.submit}>
      {replyTo && <p className={s.replyTo}>Ответ для {replyTo.author.name || "пользователя"}</p>}
      <TextArea
        value={form.text}
        onChange={(event) => form.setText(event.target.value)}
        rows={3}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={form.isSending}
        required
        aria-label={comment ? "Текст комментария" : "Новый комментарий"}
        placeholder={replyTo ? "Напишите ответ…" : "Напишите комментарий…"}
      />
      <div className={s.buttons}>
        <Button type="submit" isLoading={form.isSending} disabled={!form.text.trim()}>
          {comment ? "Сохранить" : "Отправить"}
        </Button>
        {onCancel && (
          <Button variant="secondary" disabled={form.isSending} onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
