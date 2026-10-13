"use client";

import { useState } from "react";
import { RtnAttachmentsField, useRtnAttachments, type RtnFile } from "@/source/entities/rtn";
import Button from "@/source/shared/ui/Button";
import { TextArea } from "@/source/shared/ui/Inputs";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ReplyForm.module.scss";

interface ReplyFormProps {
  onSubmit: (text: string, attachments: RtnFile[]) => Promise<void>;
}

/** Ответ ведомства на вопрос: без приложенного документа не публикуется. */
export function ReplyForm({ onSubmit }: ReplyFormProps) {
  const { showError, showSuccess } = useNotifications();
  const attachments = useRtnAttachments();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = async () => {
    setIsSending(true);
    try {
      await onSubmit(text, attachments.files);
      setText("");
      attachments.clear();
      showSuccess("Ответ опубликован");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось опубликовать ответ");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={s.form}>
      <span className={s.title}>Есть ответ ведомства по этому вопросу?</span>
      <p className={s.hint}>Приложите документ — без него комментарий не публикуется. Текст поясняет, что именно в файле.</p>

      <RtnAttachmentsField label="Документ" attachments={attachments} />
      <TextArea
        rows={3}
        placeholder="Например: официальный ответ Приуральского управления от 12.05.2026"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <Button
        type="button"
        variant="primary"
        className={s.submit}
        onClick={submit}
        disabled={attachments.files.length === 0 || attachments.isUploading}
        isLoading={isSending}
      >
        Опубликовать ответ
      </Button>
    </div>
  );
}
