"use client";

import type { PostComment } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { TextArea } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import { useCommentForm } from "../model/useCommentForm";
import s from "./comments.module.scss";

interface Props {
  postId: number;
  comment?: PostComment;
  replyTo?: PostComment;
  onSaved: () => void;
  onCancel?: () => void;
}

/** Форма комментария; гостю показывает предложение войти. */
export function CommentForm(props: Props) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const form = useCommentForm(props);
  if (!user)
    return (
      <div className={s.guest}>
        <p>Войдите, чтобы участвовать в обсуждении.</p>
        <Button
          variant="outline"
          onClick={() => openAuth("login")}
        >
          Войти
        </Button>
      </div>
    );
  return (
    <form
      className={s.form}
      onSubmit={form.submit}
    >
      {props.replyTo && (
        <p className={s.replyTo}>Ответ для {props.replyTo.author.name || "пользователя"}</p>
      )}
      <TextArea
        value={form.text}
        onChange={(event) => form.setText(event.target.value)}
        rows={3}
        maxLength={5000}
        disabled={form.busy}
        required
        aria-label={props.comment ? "Текст комментария" : "Новый комментарий"}
        placeholder={props.replyTo ? "Напишите ответ…" : "Напишите комментарий…"}
      />
      {form.error && (
        <p
          className={s.error}
          role="alert"
        >
          {form.error}
        </p>
      )}
      <div className={s.buttons}>
        <Button
          type="submit"
          isLoading={form.busy}
          disabled={!form.text.trim()}
        >
          {props.comment ? "Сохранить" : "Отправить"}
        </Button>
        {props.onCancel && (
          <Button
            variant="secondary"
            disabled={form.busy}
            onClick={props.onCancel}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
