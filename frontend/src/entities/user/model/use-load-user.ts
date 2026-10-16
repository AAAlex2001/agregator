"use client";

import { useUserContext } from "./user-provider";
import { loadUserProfile } from "./load-user-profile";

/** Перезагружает профиль; ошибка остаётся в provider и передаётся вызывающей фиче. */
export function useLoadUser() {
  const { state, dispatch, profileRequestVersionRef } = useUserContext();

  /** Запрашивает актуального пользователя для действующей сессии. */
  function loadUser() {
    return loadUserProfile(dispatch, profileRequestVersionRef);
  }

  return {
    isLoading: state.isLoading,
    error: state.error,
    loadUser,
  };
}
