"use client";

import { useState, type FormEvent } from "react";
import { RtnAttachmentsField, useRtnAttachments, type RtnFile } from "@/source/entities/rtn";
import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./CommentForm.module.scss";

interface CommentFormProps {
  placeholder: string;
  submitLabel?: string;
  onSubmit: (text: string, attachments: RtnFile[]) => Promise<void>;
}

/** Текст комментария или ответа с вложениями. */
export function CommentForm({ placeholder, submitLabel = "Отправить", onSubmit }: CommentFormProps) {
  const { showError } = useNotifications();
  const attachments = useRtnAttachments();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    setIsSending(true);
    try {
      await onSubmit(value, attachments.files);
      setText("");
      attachments.clear();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить комментарий");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form className={s.form} onSubmit={submit}>
      <textarea
        className={s.textarea}
        rows={3}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <RtnAttachmentsField label="Вложения" attachments={attachments} />
      <Button variant="primary" size="md" type="submit" isLoading={isSending} disabled={attachments.isUploading}>
        {submitLabel}
      </Button>
    </form>
  );
}
