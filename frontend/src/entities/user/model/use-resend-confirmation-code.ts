"use client";

import { useState } from "react";
import { resendConfirmationCode } from "../api/resend-confirmation-code";
import type { UserRole } from "./types";

/** Повторно отправляет письмо и хранит состояние этого запроса. */
export function useResendConfirmationCode() {
  const [isSending, setIsSending] = useState(false);

  /** Запрашивает новый код для указанного адреса и роли. */
  async function sendCode(email: string, role: UserRole | null): Promise<void> {
    setIsSending(true);

    try {
      await resendConfirmationCode(email, role);
    } finally {
      setIsSending(false);
    }
  }

  return {
    isSending,
    sendCode,
  };
}
