"use client";

import { useState } from "react";
import { confirmEmailChange } from "../api/confirm-email-change";
import { useUser } from "./use-user";

/** Подтверждает смену почты и применяет возвращённый сервером профиль. */
export function useConfirmEmailChange() {
  const [isConfirming, setIsConfirming] = useState(false);
  const { updateUser } = useUser();

  /** Применяет новый адрес только к текущему аккаунту. */
  async function confirm(code: string) {
    setIsConfirming(true);

    try {
      const user = await confirmEmailChange(code);
      updateUser(user);
      return user;
    } finally {
      setIsConfirming(false);
    }
  }

  return {
    isConfirming,
    confirm,
  };
}
