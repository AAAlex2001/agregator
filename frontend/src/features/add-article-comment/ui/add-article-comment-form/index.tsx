"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/shared/ui/button";
import { useAddArticleComment } from "../../model/use-add-article-comment";
import styles from "./style.module.scss";

/** Поле нового комментария или ответа с действием после отправки. */
interface AddArticleCommentFormProps {
  parentId?: number | null;
  placeholder: string;
  submitLabel?: string;
  onAdded?: () => void;
}

/** Показывает поле и кнопку отправки комментария под статьёй. */
export function AddArticleCommentForm({
  parentId = null,
  placeholder,
  submitLabel = "Отправить",
  onAdded,
}: AddArticleCommentFormProps) {
  const { text, isSending, setText, submit } = useAddArticleComment({
    parentId,
    onAdded,
  });

  /** Обновляет текст комментария по мере ввода. */
  function changeText(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder={placeholder}
        value={text}
        onChange={changeText}
      />
      <Button
        variant="primary"
        size="md"
        type="submit"
        isLoading={isSending}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
