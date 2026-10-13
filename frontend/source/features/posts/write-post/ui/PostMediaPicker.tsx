"use client";

import Image from "next/image";
import { useRef } from "react";
import type { PostMedia } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { MAX_POST_MEDIA, MEDIA_ACCEPT } from "../lib/mediaValidation";
import { ImageIcon } from "./icons";
import s from "./PostMediaPicker.module.scss";

interface PostMediaPickerProps {
  files: PostMedia[];
  disabled: boolean;
  isBusy: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (file: PostMedia) => void;
}

/** Фото и видео публикации: превью и удаление. */
export function PostMediaPicker({
  files,
  disabled,
  isBusy,
  onUpload,
  onRemove,
}: PostMediaPickerProps) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <section className={s.section} aria-label="Фото и видео">
      <h2 className={s.title}>Фото и видео</h2>
      <div className={s.grid}>
        {files.map((file) => (
          <div key={file.id} className={s.tile}>
            {file.kind === "video" ? (
              <video src={file.url} controls preload="metadata" playsInline />
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
              className={s.remove}
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
          onClick={() => input.current?.click()}
        >
          <ImageIcon />
          Добавить фото или видео
        </Button>
      )}
      <p className={s.hint}>
        До 10 файлов по 50 МБ. Фото: JPEG, PNG, WebP. Видео: MP4, MOV.
      </p>
      <input
        ref={input}
        className={s.file}
        type="file"
        accept={MEDIA_ACCEPT}
        multiple
        disabled={disabled}
        onChange={(event) => {
          onUpload(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
    </section>
  );
}
