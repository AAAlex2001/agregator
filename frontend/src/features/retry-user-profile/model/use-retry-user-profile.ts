"use client";

import { useLoadUser } from "@/entities/user";

/** Повторяет загрузку профиля после сбоя, сохраняя ошибку в состоянии пользователя. */
export function useRetryUserProfile() {
  const { error, isLoading, loadUser } = useLoadUser();

  /** Повторяет только запрос профиля для уже подтверждённой сессии. */
  async function retry() {
    if (isLoading) {
      return;
    }

    try {
      await loadUser();
    } catch {
      // useLoadUser сохраняет ошибку для повторного показа на странице.
    }
  }

  return {
    error,
    retry,
  };
}
