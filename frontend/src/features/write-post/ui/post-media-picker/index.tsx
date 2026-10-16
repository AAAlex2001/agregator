"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ChangeEvent } from "react";
import type { PostMedia } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { ImageIcon } from "@/shared/ui/icons";
import { MAX_POST_MEDIA, POST_MEDIA_ACCEPT } from "../../config/media";
import styles from "./style.module.scss";

/** Прикреплённые файлы, блокировка и действия с ними. */
interface PostMediaPickerProps {
  files: PostMedia[];
  disabled: boolean;
  isBusy: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (file: PostMedia) => void;
}

/** Фото и видео публикации: превью, удаление и выбор новых файлов. */
export function PostMediaPicker({
  files,
  disabled,
  isBusy,
  onUpload,
  onRemove,
}: PostMediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /** Открывает системный выбор файлов. */
  function pickFiles() {
    inputRef.current?.click();
  }

  /** Передаёт выбранные файлы и очищает поле для повторного выбора тех же файлов. */
  function uploadPicked(event: ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files ? [...event.target.files] : [];

    onUpload(picked);
    event.target.value = "";
  }

  return (
    <section
      className={styles.section}
      aria-label="Фото и видео"
    >
      <h2 className={styles.title}>Фото и видео</h2>
      <div className={styles.grid}>
        {files.map((file) => (
          <div
            key={file.id}
            className={styles.tile}
          >
            {file.kind === "video" ? (
              <video
                src={file.url}
                controls
                preload="metadata"
                playsInline
              />
            ) : (
              <Image
                src={file.url}
                alt="Фото публикации"
                width={224}
                height={200}
                unoptimized
              />
            )}
            <button
              type="button"
              className={styles.remove}
              aria-label="Удалить файл"
              disabled={disabled}
              onClick={() => onRemove(file)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {files.length < MAX_POST_MEDIA && (
        <Button
          variant="outline"
          disabled={disabled}
          isLoading={isBusy}
          onClick={pickFiles}
        >
          <ImageIcon />
          Добавить фото или видео
        </Button>
      )}
      <p className={styles.hint}>
        До 10 файлов по 50 МБ. Фото: JPEG, PNG, WebP. Видео: MP4, MOV.
      </p>
      <input
        ref={inputRef}
        className={styles.file}
        type="file"
        accept={POST_MEDIA_ACCEPT}
        multiple
        disabled={disabled}
        onChange={uploadPicked}
      />
    </section>
  );
}
