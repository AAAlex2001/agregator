"use client";

import { useState } from "react";
import { logout, useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";

/** Завершает серверную сессию и передаёт управление вызывающему экрану. */
export function useLogout(onSuccess: () => void) {
  const { clearUser } = useUser();
  const { showError } = useNotifications();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function signOut() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
      clearUser();
      onSuccess();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось выйти",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return { isLoggingOut, logout: signOut };
}
