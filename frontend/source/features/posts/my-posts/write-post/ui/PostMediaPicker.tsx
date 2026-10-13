"use client";

import { useRef } from "react";
import Image from "next/image";
import type { PostMedia } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import {
  ImageIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/source/features/posts/editor/icons";
import { MAX_POST_MEDIA } from "../lib/mediaValidation";
import s from "./PostMediaPicker.module.scss";

interface Props {
  files: PostMedia[];
  uploading: number;
  removing: number | null;
  disabled: boolean;
  error: string | null;
  onUpload: (files: File[]) => Promise<void>;
  onRemove: (file: PostMedia) => Promise<void>;
  onMove: (index: number, direction: number) => void;
}

/** Вложения публикации с предпросмотром, удалением и сменой порядка. */
export function PostMediaPicker({
  files,
  uploading,
  removing,
  disabled,
  error,
  onUpload,
  onRemove,
  onMove,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const busy = disabled || uploading > 0 || removing !== null;
  return (
    <section className={s.section} aria-label="Фото и видео">
      <h2 className={s.title}>Фото и видео</h2>
      <div className={s.grid}>
        {files.map((file, index) => (
          <div key={file.id} className={s.tile}>
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
                alt={`Фото ${index + 1}`}
                width={224}
                height={200}
                unoptimized
              />
            )}
            <button
              type="button"
              className={s.remove}
              aria-label={`Удалить файл ${index + 1}`}
              disabled={busy}
              onClick={() => onRemove(file)}
            >
              {removing === file.id ? "…" : "×"}
            </button>
            <div className={s.order}>
              <button
                type="button"
                aria-label={`Переместить файл ${index + 1} влево`}
                disabled={busy || index === 0}
                onClick={() => onMove(index, -1)}
              >
                <ArrowLeftIcon />
              </button>
              <span>{index + 1}</span>
              <button
                type="button"
                aria-label={`Переместить файл ${index + 1} вправо`}
                disabled={busy || index === files.length - 1}
                onClick={() => onMove(index, 1)}
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: uploading }, (_, index) => (
          <div key={`upload-${index}`} className={s.tile}>
            <Loader size="sm" label="Загрузка" />
          </div>
        ))}
      </div>
      {files.length < MAX_POST_MEDIA && (
        <Button
          variant="outline"
          disabled={busy}
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
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,.jpg,.jpeg,.png,.webp,.mp4,.mov"
        multiple
        disabled={busy}
        onChange={(event) => {
          void onUpload(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
