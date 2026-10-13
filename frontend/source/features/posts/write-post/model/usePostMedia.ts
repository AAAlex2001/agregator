"use client";

import { useState } from "react";
import {
  deletePostMedia,
  uploadPostMedia,
  type PostMedia,
} from "@/source/entities/posts";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { MAX_POST_MEDIA } from "../lib/mediaValidation";

/** Фото и видео публикации: загрузка и удаление.
 *  Формат и размер проверяет сервер; файлы сохранённого поста удаляются при сохранении. */
export function usePostMedia(initial: PostMedia[]) {
  const { showError } = useNotifications();
  const [files, setFiles] = useState(initial);
  const [isBusy, setIsBusy] = useState(false);

  const upload = async (picked: File[]) => {
    if (files.length + picked.length > MAX_POST_MEDIA) {
      showError(`Можно добавить не больше ${MAX_POST_MEDIA} файлов`);
      return;
    }

    setIsBusy(true);
    try {
      const uploaded = await Promise.all(picked.map(uploadPostMedia));
      setFiles([...files, ...uploaded]);
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsBusy(false);
    }
  };

  const remove = async (file: PostMedia) => {
    setIsBusy(true);
    try {
      if (!initial.includes(file)) {
        await deletePostMedia(file.id);
      }
      setFiles(files.filter((item) => item !== file));
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsBusy(false);
    }
  };

  return {
    files,
    isBusy,
    upload,
    remove,
  };
}
