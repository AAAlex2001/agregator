"use client";

import { useState } from "react";
import { confirmEmail } from "../api/confirm-email";
import { useUserContext } from "./user-provider";
import type { LoginResponse, UserRole } from "./types";

/** Сохраняет подтверждённый аккаунт до отдельной загрузки его полного профиля. */
export function useConfirmEmail() {
  const [account, setAccount] = useState<LoginResponse | null>(null);
  const { dispatch, profileRequestVersionRef } = useUserContext();

  /** Подтверждает код и освобождает состояние от профиля предыдущего аккаунта. */
  async function confirm(
    email: string,
    code: string,
    role: UserRole | null,
  ): Promise<LoginResponse> {
    const confirmedAccount = await confirmEmail(email, code, role);

    profileRequestVersionRef.current += 1;
    dispatch({
      type: "account/authenticated",
      role: confirmedAccount.role,
    });
    setAccount(confirmedAccount);

    return confirmedAccount;
  }

  return {
    account,
    confirm,
  };
}
