"use client";

import type { ChangeEvent } from "react";
import { RtnAttachmentsField } from "@/entities/rtn";
import { Button } from "@/shared/ui/button";
import { TextArea } from "@/shared/ui/text-area";
import type { ReplyToRtnQuestionOptions } from "../../model/types";
import { useReplyToRtnQuestion } from "../../model/use-reply-to-rtn-question";
import styles from "./style.module.scss";

/** Показывает загрузку ответа ведомства и пояснение к документу. */
export function RtnQuestionReplyForm({
  questionId,
  onAdded,
}: ReplyToRtnQuestionOptions) {
  const {
    text,
    setText,
    attachments,
    isSending,
    submit,
  } = useReplyToRtnQuestion({
    questionId,
    onAdded,
  });

  /** Обновляет пояснение к приложенному документу. */
  function changeText(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  return (
    <div className={styles.form}>
      <span className={styles.title}>Есть ответ ведомства по этому вопросу?</span>
      <p className={styles.hint}>
        Приложите документ — без него комментарий не публикуется. Текст поясняет,
        что именно в файле.
      </p>
      <RtnAttachmentsField
        label="Документ"
        attachments={attachments}
      />
      <TextArea
        rows={3}
        placeholder="Например: официальный ответ Приуральского управления от 12.05.2026"
        value={text}
        onChange={changeText}
      />
      <Button
        type="button"
        variant="primary"
        className={styles.submit}
        onClick={submit}
        disabled={attachments.files.length === 0 || attachments.isUploading}
        isLoading={isSending}
      >
        Опубликовать ответ
      </Button>
    </div>
  );
}
