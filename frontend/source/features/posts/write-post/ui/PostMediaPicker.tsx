"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeftIcon, type PostMedia } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import { MAX_POST_MEDIA, MEDIA_ACCEPT } from "../lib/mediaValidation";
import { ArrowRightIcon, ImageIcon } from "./icons";
import s from "./PostMediaPicker.module.scss";

interface PostMediaPickerProps {
  files: PostMedia[];
  uploading: number;
  removingId: number | null;
  disabled: boolean;
  onUpload: (files: File[]) => void;
  onRemove: (file: PostMedia) => void;
  onMove: (file: PostMedia, step: -1 | 1) => void;
}

/** Фото и видео публикации: превью, удаление и порядок показа. */
export function PostMediaPicker({ files, uploading, removingId, disabled, onUpload, onRemove, onMove }: PostMediaPickerProps) {
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
              <Image src={file.url} alt="Фото публикации" width={224} height={200} unoptimized />
            )}
            <button
              type="button"
              className={s.remove}
              aria-label="Удалить файл"
              disabled={disabled}
              onClick={() => onRemove(file)}
            >
              {removingId === file.id ? "…" : "×"}
            </button>
            <div className={s.order}>
              <button
                type="button"
                aria-label="Переместить левее"
                disabled={disabled || file === files.at(0)}
                onClick={() => onMove(file, -1)}
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                aria-label="Переместить правее"
                disabled={disabled || file === files.at(-1)}
                onClick={() => onMove(file, 1)}
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        ))}
        {uploading > 0 && (
          <div className={s.tile}>
            <Loader size="sm" label={`Загрузка: ${uploading}`} />
          </div>
        )}
      </div>
      {files.length < MAX_POST_MEDIA && (
        <Button variant="outline" disabled={disabled} onClick={() => input.current?.click()}>
          <ImageIcon />
          Добавить фото или видео
        </Button>
      )}
      <p className={s.hint}>До 10 файлов по 50 МБ. Фото: JPEG, PNG, WebP. Видео: MP4, MOV.</p>
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
