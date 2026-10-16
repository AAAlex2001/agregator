"use client";

import { useState } from "react";
import { switchRole } from "../api/switch-role";
import { useUserContext } from "./user-provider";
import type { LoginResponse, UserRole } from "./types";

/** Переключает сессию и запоминает подтверждённый аккаунт до загрузки профиля. */
export function useSwitchAccountRole() {
  const [account, setAccount] = useState<LoginResponse | null>(null);
  const { dispatch, profileRequestVersionRef } = useUserContext();

  /** Подтверждает новую роль и убирает данные прежнего аккаунта. */
  async function switchAccountRole(role: UserRole, password: string) {
    const confirmedAccount = await switchRole(role, password);

    profileRequestVersionRef.current += 1;
    dispatch({
      type: "account/authenticated",
      role: confirmedAccount.role,
    });
    setAccount(confirmedAccount);

    return confirmedAccount;
  }

  /** Забывает результат предыдущей попытки при новом выборе роли. */
  function reset() {
    setAccount(null);
  }

  return {
    account,
    switchAccountRole,
    reset,
  };
}
