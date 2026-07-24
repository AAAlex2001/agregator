"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import { FileIcon } from "@/source/shared/ui/icons";
import { uploadRtnCommentAttachment, type RtnCommentAttachment } from "@/source/entities/rtn-comment";
import s from "./RtnDiscussion.module.scss";

interface Props {
  placeholder: string;
  submitLabel?: string;
  onSubmit: (text: string, attachments: RtnCommentAttachment[]) => Promise<void>;
}

export function RtnCommentForm({ placeholder, submitLabel = "Отправить", onSubmit }: Props) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<RtnCommentAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickFile = () => fileInputRef.current?.click();

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const attachment = await uploadRtnCommentAttachment(file);
      setAttachments((prev) => [...prev, attachment]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить файл");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (url: string) => setAttachments((prev) => prev.filter((a) => a.url !== url));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      await onSubmit(value, attachments);
      setText("");
      setAttachments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={s.form} onSubmit={submit}>
      <textarea
        className={s.textarea}
        rows={3}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {attachments.length > 0 && (
        <ul className={s.attachmentList}>
          {attachments.map((attachment) => (
            <li key={attachment.url} className={s.attachmentChip}>
              <FileIcon className={s.attachmentIcon} />
              <span>{attachment.name}</span>
              <button type="button" onClick={() => removeAttachment(attachment.url)} aria-label="Убрать вложение">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <span className={s.error}>{error}</span>}

      <div className={s.formActions}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className={s.hiddenInput}
          onChange={onFileSelected}
        />
        <Button variant="transparent" size="sm" type="button" onClick={pickFile} disabled={uploading}>
          {uploading ? "Загрузка…" : "Прикрепить файл"}
        </Button>
        <Button variant="primary" size="md" type="submit" isLoading={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
