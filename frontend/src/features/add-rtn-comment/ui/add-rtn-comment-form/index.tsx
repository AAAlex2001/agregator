"use client";

import type { ChangeEvent, FormEvent } from "react";
import { RtnAttachmentsField } from "@/entities/rtn";
import { Button } from "@/shared/ui/button";
import { useAddRtnComment } from "../../model/use-add-rtn-comment";
import styles from "./style.module.scss";

/** Форма нового комментария или ответа под разъяснением РТН. */
interface AddRtnCommentFormProps {
  parentId?: number | null;
  placeholder: string;
  submitLabel?: string;
  onAdded?: () => void;
}

/** Показывает текст комментария, загруженные вложения и кнопку отправки. */
export function AddRtnCommentForm({
  parentId = null,
  placeholder,
  submitLabel = "Отправить",
  onAdded,
}: AddRtnCommentFormProps) {
  const {
    text,
    setText,
    attachments,
    isSending,
    submit,
  } = useAddRtnComment({
    parentId,
    onAdded,
  });

  /** Обновляет текст комментария по мере ввода. */
  function changeText(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  /** Отправляет комментарий без перезагрузки страницы. */
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  return (
    <form
      className={styles.form}
      onSubmit={submitForm}
    >
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder={placeholder}
        value={text}
        onChange={changeText}
      />
      <RtnAttachmentsField
        label="Вложения"
        attachments={attachments}
      />
      <Button
        variant="primary"
        size="md"
        type="submit"
        isLoading={isSending}
        disabled={attachments.isUploading}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
