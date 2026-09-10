"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import { TextArea } from "@/source/shared/ui/Inputs";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  addRtnQuestionReply,
  fetchRtnQuestionReplies,
  uploadRtnQuestionAttachment,
  type RtnQuestionAttachment,
  type RtnQuestionReply,
} from "@/source/entities/rtn-question";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import s from "./RtnPublicQuestions.module.scss";

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function RtnQuestionReplies({ questionId }: { questionId: number }) {
  const { showError, showSuccess } = useNotifications();
  const [replies, setReplies] = useState<RtnQuestionReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<RtnQuestionAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchRtnQuestionReplies(questionId)
      .then(setReplies)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [questionId]);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadRtnQuestionAttachment(file);
      setAttachments((prev) => [...prev, uploaded]);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const submit = async () => {
    if (attachments.length === 0) return;
    setIsSending(true);
    try {
      const reply = await addRtnQuestionReply(questionId, text, attachments);
      setReplies((prev) => [...prev, reply]);
      setText("");
      setAttachments([]);
      showSuccess("Ответ опубликован");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось опубликовать ответ");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={s.replies}>
      {isLoading ? (
        <Loader size="sm" label="Загружаем ответы" />
      ) : replies.length === 0 ? (
        <p className={s.empty}>
          Ответов пока нет. Если у вас есть письмо ведомства по этому вопросу — поделитесь им.
        </p>
      ) : (
        <ul className={s.replyList}>
          {replies.map((reply) => (
            <li key={reply.id} className={s.reply}>
              <div className={s.replyHead}>
                <span className={s.replyAuthor}>{reply.author_name}</span>
                <time className={s.replyDate} dateTime={reply.created_at}>
                  {formatDate(reply.created_at)}
                </time>
              </div>
              {reply.text && <p className={s.replyText}>{reply.text}</p>}
              <ul className={s.files}>
                {reply.attachments.map((file) => (
                  <li key={file.url}>
                    <a href={resolveFileUrl(file.url)} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <div className={s.form}>
        <span className={s.formTitle}>Есть ответ ведомства по этому вопросу?</span>
        <p className={s.formHint}>
          Приложите документ — без него комментарий не публикуется. Текст поясняет, что именно в файле.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          className={s.hiddenInput}
          onChange={(event) => pickFile(event.target.files?.[0])}
        />

        {attachments.length > 0 && (
          <ul className={s.pending}>
            {attachments.map((file) => (
              <li key={file.url}>
                <span>{file.name}</span>
                <button
                  type="button"
                  className={s.removeFile}
                  onClick={() => setAttachments((prev) => prev.filter((item) => item.url !== file.url))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <TextArea
          rows={3}
          placeholder="Например: официальный ответ Приуральского управления от 12.05.2026"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <div className={s.formActions}>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
          >
            Прикрепить документ
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={submit}
            disabled={attachments.length === 0}
            isLoading={isSending}
          >
            Опубликовать ответ
          </Button>
        </div>
      </div>
    </div>
  );
}
