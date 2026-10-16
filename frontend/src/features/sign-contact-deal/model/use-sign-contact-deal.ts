"use client";

import { useState } from "react";
import {
  signContactDeal,
  useExpertContacts,
} from "@/entities/expert-contact";
import { useNotifications } from "@/shared/ui/notifications";

/** Хранит согласие и пароль подписи; после подписи показывает новую версию сделки. */
export function useSignContactDeal(dealId: number) {
  const { showDeal } = useExpertContacts();
  const { showError, showSuccess } = useNotifications();
  const [accepted, setAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const canSign = accepted && password.length > 0;

  /** Подписывает договор паролем аккаунта и очищает форму. */
  async function sign() {
    if (!canSign || isSigning) {
      return;
    }

    setIsSigning(true);

    try {
      const deal = await signContactDeal(dealId, password);
      await showDeal(deal);
      setPassword("");
      setAccepted(false);
      showSuccess("Договор подписан");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подписать договор");
    } finally {
      setIsSigning(false);
    }
  }

  return {
    accepted,
    password,
    canSign,
    isSigning,
    changeAccepted: setAccepted,
    changePassword: setPassword,
    sign,
  };
}
