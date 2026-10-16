"use client";

import { useState } from "react";
import { requestEmailChange } from "../api/request-email-change";

/** Отправляет письмо с кодом для смены адреса аккаунта. */
export function useRequestEmailChange() {
  const [isSending, setIsSending] = useState(false);

  /** Запрашивает код на новый адрес и снимает состояние ожидания при любом ответе. */
  async function sendCode(email: string) {
    setIsSending(true);

    try {
      await requestEmailChange(email);
    } finally {
      setIsSending(false);
    }
  }

  return {
    isSending,
    sendCode,
  };
}
