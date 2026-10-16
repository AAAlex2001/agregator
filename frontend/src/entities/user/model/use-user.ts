"use client";

import { useUserContext } from "./user-provider";
import type { UserProfile } from "./types";

/** Возвращает профиль и позволяет обновить его после действий пользователя. */
export function useUser() {
  const { state, dispatch, profileRequestVersionRef } = useUserContext();

  /** Заменяет профиль и отменяет применение более старых ответов API. */
  function setUser(user: UserProfile | null): void {
    profileRequestVersionRef.current += 1;
    dispatch({
      type: "user/changed",
      user,
    });
  }

  /** Применяет сохранённые данные только к аккаунту, который всё ещё открыт. */
  function updateUser(user: UserProfile): void {
    dispatch({
      type: "profile/updated",
      user,
    });
  }

  /** Очищает локального пользователя после завершения серверной сессии. */
  function clearUser(): void {
    setUser(null);
  }

  return {
    ...state,
    setUser,
    updateUser,
    clearUser,
  };
}
