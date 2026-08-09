"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import { ChevronIcon } from "@/source/shared/ui/icons";
import {
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import type { FileGalleryItem } from "@/source/shared/ui/FileGallery";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { CATEGORY_LABEL, type TicketCategory } from "@/source/entities/ticket";
import {
  FILE_ACCEPT,
  MAX_FILES,
  MAX_MESSAGE_LENGTH,
  MAX_SUBJECT_LENGTH,
  ticketFilesError,
} from "../model/files";
import s from "./CreateTicketForm.module.scss";

interface Props {
  onCancel: () => void;
  onSubmit: (payload: {
    subject: string;
    category: TicketCategory;
    message: string;
    files: File[];
  }) => Promise<void> | void;
}

const CATEGORIES: TicketCategory[] = [
  "ORDER",
  "RESPONSE",
  "TECHNICAL",
  "BILLING",
  "ACCOUNT",
  "COMPLAINT",
  "SUGGESTION",
  "OTHER",
];

interface PreviewItem {
  file: File;
  url: string;
}

export function CreateTicketForm({ onCancel, onSubmit }: Props) {
  const { showError } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("ORDER");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await onSubmit({
        subject: subject.trim(),
        category,
        message: message.trim(),
        files,
      });
    } finally {
      setSending(false);
    }
  };

  const handleAddFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = Array.from(list);
    const error = ticketFilesError(files, next);
    if (error) {
      showError(error);
      return;
    }
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const galleryItems: FileGalleryItem[] = files
    .map((file, index) => {
      const url = previews.find((item) => item.file === file)?.url ?? "";
      const isImage = isImageFileName(file.name);
      return {
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        url,
        previewUrl: isImage ? url : getFileGalleryPreviewUrl(url, file.name),
        thumbnailUrl: getFileGalleryThumbUrl(url, file.name),
        isImage,
        onRemove: () => removeFile(index),
      };
    })
    .filter((item) => item.url);

  return (
    <form className={s.panel} onSubmit={submit}>
      <header className={s.head}>
        <button
          type="button"
          className={s.backButton}
          onClick={onCancel}
          aria-label="Назад к списку"
        >
          <ChevronIcon />
          <span>К списку</span>
        </button>
        <h2 className={s.title}>Новое обращение</h2>
        <p className={s.subtitle}>
          Опишите проблему максимально подробно — это ускорит ответ.
        </p>
      </header>

      <div className={s.body}>
        <div className={s.field}>
          <label className={s.label} htmlFor="ticket-subject">
            Тема обращения
          </label>
          <TextInput
            id="ticket-subject"
            placeholder="Кратко опишите суть"
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value.slice(0, MAX_SUBJECT_LENGTH))}
          />
        </div>

        <div className={s.field}>
          <span className={s.label}>Категория</span>
          <div className={s.categories}>
            {CATEGORIES.map((cat) => {
              const active = cat === category;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`${s.categoryChip} ${active ? s.categoryActive : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {CATEGORY_LABEL[cat]}
                </button>
              );
            })}
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="ticket-message">
            Сообщение
          </label>
          <textarea
            id="ticket-message"
            className={s.textarea}
            placeholder="Опишите вопрос. Если связан с заказом или откликом — укажите номер."
            rows={6}
            required
            maxLength={MAX_MESSAGE_LENGTH}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className={s.fieldFoot}>
            <span />
            <span className={s.counter}>
              {message.length} / {MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>

        <div className={s.field}>
          <FileGallery
            items={galleryItems}
            label="Файлы (необязательно)"
            labelClassName={s.label}
            hint={`До ${MAX_FILES} файлов: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX`}
            hintClassName={s.fieldHint}
            variant="editable"
            onAdd={() => {
              if (files.length >= MAX_FILES) {
                showError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
                return;
              }
              fileInputRef.current?.click();
            }}
            input={(
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={FILE_ACCEPT}
                className={s.hiddenInput}
                onChange={(event) => {
                  handleAddFiles(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            )}
          />
        </div>
      </div>

      <footer className={s.footer}>
        <Button variant="outline" size="md" onClick={onCancel} type="button">
          Отмена
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={sending}
          isLoading={sending}
        >
          Отправить обращение
        </Button>
      </footer>
    </form>
  );
}
