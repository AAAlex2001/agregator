"use client";

import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { TextArea } from "@/shared/ui/text-area";
import type { CommentFormOptions } from "../../model/types";
import { useCommentForm } from "../../model/use-comment-form";
import styles from "./style.module.scss";

/** Наибольшая длина комментария, которую принимает сервер. */
const MAX_COMMENT_LENGTH = 2000;

/** Комментарий, отмена правки или ответа и вход для гостя. */
interface CommentFormProps extends CommentFormOptions {
  onCancel?: () => void;
  onLogin: () => void;
}

/** Форма комментария, ответа или правки; гостю вместо формы — предложение войти. */
export function CommentForm({
  postId,
  comment,
  replyTo,
  onSaved,
  onCancel,
  onLogin,
}: CommentFormProps) {
  const { user } = useUser();
  const {
    text,
    isSending,
    setText,
    submit,
  } = useCommentForm({
    postId,
    comment,
    replyTo,
    onSaved,
  });

  if (!user) {
    return (
      <div className={styles.guest}>
        <p>Войдите, чтобы участвовать в обсуждении.</p>
        <Button
          variant="outline"
          onClick={onLogin}
        >
          Войти
        </Button>
      </div>
    );
  }

  const label = comment ? "Текст комментария" : "Новый комментарий";
  const placeholder = replyTo ? "Напишите ответ…" : "Напишите комментарий…";

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      {replyTo && (
        <p className={styles.replyTo}>
          Ответ для {replyTo.author.name || "пользователя"}
        </p>
      )}
      <TextArea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={isSending}
        required
        aria-label={label}
        placeholder={placeholder}
      />
      <div className={styles.buttons}>
        <Button
          type="submit"
          isLoading={isSending}
          disabled={!text.trim()}
        >
          {comment ? "Сохранить" : "Отправить"}
        </Button>
        {onCancel && (
          <Button
            variant="secondary"
            disabled={isSending}
            onClick={onCancel}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
