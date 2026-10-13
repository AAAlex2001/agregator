"use client";

import { useEffect, useRef, useState } from "react";
import {
  deletePostMedia,
  uploadPostMedia,
  type PostMedia,
} from "@/source/entities/posts";
import { MAX_POST_MEDIA, validatePostMedia } from "../lib/mediaValidation";

/** Загружает вложения; удаляет только новые файлы, ещё не сохранённые с постом. */
export function usePostMedia(initial: PostMedia[] = []) {
  const [files, setFiles] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [removing, setRemoving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploaded = useRef(new Set<number>());
  const operation = useRef<"upload" | "remove" | "save" | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const unsaved = uploaded.current;
    return () => {
      mounted.current = false;
      if (operation.current !== "save") {
        for (const id of unsaved) void deletePostMedia(id).catch(() => {});
      }
    };
  }, []);

  /** Загружает выбранные файлы по очереди. */
  async function upload(selected: File[]) {
    if (operation.current) return;
    const availableSlots = MAX_POST_MEDIA - files.length;
    const accepted = selected.slice(0, availableSlots);
    for (const file of accepted) {
      const error = validatePostMedia(file);
      if (error) {
        setError(error);
        return;
      }
    }
    operation.current = "upload";
    setError(
      selected.length > accepted.length
        ? `Можно добавить не больше ${MAX_POST_MEDIA} файлов`
        : null,
    );
    setUploading(accepted.length);

    try {
      for (const file of accepted) {
        const media = await uploadPostMedia(file);
        if (!mounted.current) {
          await deletePostMedia(media.id);
          break;
        }
        uploaded.current.add(media.id);
        setFiles((current) => [...current, media]);
        setUploading((count) => count - 1);
      }
    } catch (failure) {
      if (mounted.current)
        setError(
          failure instanceof Error
            ? failure.message
            : "Не удалось загрузить файл",
        );
    } finally {
      operation.current = null;
      if (mounted.current) setUploading(0);
    }
  }

  /** Убирает вложение, не затрагивая сохранённые файлы поста. */
  async function remove(file: PostMedia) {
    if (operation.current) return;
    operation.current = "remove";
    setRemoving(file.id);
    setError(null);
    try {
      if (uploaded.current.has(file.id)) {
        await deletePostMedia(file.id);
        uploaded.current.delete(file.id);
      }
      setFiles((current) => current.filter((item) => item.id !== file.id));
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Не удалось удалить файл",
      );
    } finally {
      operation.current = null;
      setRemoving(null);
    }
  }

  /** Меняет порядок вложений. */
  function move(index: number, direction: number) {
    if (operation.current) return;
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const reordered = [...files];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setFiles(reordered);
  }

  /** Сохраняет вложения до завершения запроса публикации. */
  function startSaving() {
    if (operation.current) return false;
    operation.current = "save";
    return true;
  }

  /** Освобождает только вложения отменённой формы. */
  function finishSaving(saved: boolean) {
    operation.current = null;
    if (saved) uploaded.current.clear();
    else if (!mounted.current) {
      for (const id of uploaded.current)
        void deletePostMedia(id).catch(() => {});
    }
  }

  return {
    files,
    uploading,
    removing,
    error,
    busy: uploading > 0 || removing !== null,
    upload,
    remove,
    move,
    startSaving,
    finishSaving,
  };
}
