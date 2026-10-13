"use client";

import { useState } from "react";
import {
  deletePostMedia,
  uploadPostMedia,
  type PostMedia,
} from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { MAX_POST_MEDIA, mediaProblem } from "../lib/mediaValidation";

/**
 * Фото и видео публикации: загрузка, удаление и порядок.
 * Файлы уже сохранённого поста удаляются при сохранении.
 */
export function usePostMedia(initial: PostMedia[]) {
  const { showError } = useNotifications();
  const [files, setFiles] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const upload = async (picked: File[]) => {
    const problem = picked.map(mediaProblem).find(Boolean);
    if (problem) {
      return showError(problem);
    }

    if (files.length + picked.length > MAX_POST_MEDIA) {
      return showError(`Можно добавить не больше ${MAX_POST_MEDIA} файлов`);
    }

    setUploading(picked.length);
    try {
      const uploaded = await Promise.all(picked.map(uploadPostMedia));
      setFiles([...files, ...uploaded]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить файл";
      showError(message);
    } finally {
      setUploading(0);
    }
  };

  const remove = async (file: PostMedia) => {
    setRemovingId(file.id);
    try {
      if (!initial.includes(file)) {
        await deletePostMedia(file.id);
      }

      setFiles(files.filter((item) => item !== file));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось удалить файл";
      showError(message);
    } finally {
      setRemovingId(null);
    }
  };

  const move = (file: PostMedia, step: -1 | 1) => {
    const rest = files.filter((item) => item !== file);
    const position = files.indexOf(file) + step;
    setFiles([...rest.slice(0, position), file, ...rest.slice(position)]);
  };

  const isBusy = uploading > 0 || removingId !== null;

  return {
    files,
    uploading,
    removingId,
    isBusy,
    upload,
    remove,
    move,
  };
}
