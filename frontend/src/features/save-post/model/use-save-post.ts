"use client";

import { useState } from "react";
import { togglePostSave } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Закладка публикации; гостю вместо сохранения открывает вход. */
export function useSavePost(post: Post, onLogin: () => void) {
  const { user } = useUser();
  const { showSuccess, showError } = useNotifications();
  const [saved, setSaved] = useState(post.saved);
  const [isSending, setIsSending] = useState(false);

  /** Добавляет публикацию в сохранённое или убирает её оттуда. */
  async function toggleSave() {
    if (!user) {
      onLogin();
      return;
    }

    setIsSending(true);

    try {
      await togglePostSave(post.id, !saved);
      setSaved(!saved);
      showSuccess(saved ? "Публикация убрана из сохранённого" : "Публикация сохранена");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось изменить сохранённое",
      );
    } finally {
      setIsSending(false);
    }
  }

  return {
    saved,
    isSending,
    toggleSave,
  };
}
