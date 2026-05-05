"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
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
  createTicketSchema,
  FILE_ACCEPT,
  MAX_FILES,
  MAX_MESSAGE_LENGTH,
  type CreateTicketValues,
} from "../model/schemas";
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
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      category: "ORDER",
      message: "",
      files: [],
    },
  });

  const files = watch("files");
  const message = watch("message");
  const category = watch("category");

  useEffect(() => {
    const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files]);

  const submit = handleSubmit(
    async (values) => {
      await onSubmit({
        subject: values.subject.trim(),
        category: values.category,
        message: values.message.trim(),
        files: values.files,
      });
    },
    (formErrors) => {
      const first = Object.values(formErrors)[0];
      const message = (first && typeof first === "object" && "message" in first
        ? (first as { message?: string }).message
        : undefined) ?? "Проверьте поля формы";
      showError(message);
    },
  );

  const handleAddFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = Array.from(list);
    if (files.length + next.length > MAX_FILES) {
      showError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
      return;
    }
    setValue("files", [...files, ...next], { shouldValidate: true, shouldDirty: true });
  };

  const removeFile = (index: number) => {
    setValue(
      "files",
      files.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true },
    );
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
    <form className={s.panel} onSubmit={submit} noValidate>
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
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Input
                id="ticket-subject"
                variant="text"
                placeholder="Кратко опишите суть"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                error={errors.subject?.message}
              />
            )}
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
                  onClick={() => setValue("category", cat, { shouldValidate: true })}
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
            {...register("message")}
          />
          <div className={s.fieldFoot}>
            {errors.message?.message ? (
              <span className={s.fieldError}>{errors.message.message}</span>
            ) : <span />}
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
          {errors.files?.message && (
            <span className={s.fieldError}>{errors.files.message}</span>
          )}
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
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          Отправить обращение
        </Button>
      </footer>
    </form>
  );
}
