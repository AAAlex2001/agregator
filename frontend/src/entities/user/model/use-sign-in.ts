"use client";

import { useState } from "react";
import { login } from "../api/login";
import { useUserContext } from "./user-provider";
import type { LoginCredentials, LoginResponse } from "./types";

interface SignInState {
  account: LoginResponse | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: SignInState = {
  account: null,
  isLoading: false,
  error: null,
};

/** Выполняет вход и хранит его результат отдельно от загрузки полного профиля. */
export function useSignIn() {
  const [state, setState] = useState(INITIAL_STATE);
  const { dispatch, profileRequestVersionRef } = useUserContext();

  /** Проверяет реквизиты и запоминает аккаунт, для которого сервер открыл сессию. */
  async function signIn(credentials: LoginCredentials): Promise<LoginResponse> {
    setState({ account: null, isLoading: true, error: null });

    try {
      const account = await login(credentials);

      profileRequestVersionRef.current += 1;
      dispatch({ type: "account/authenticated", role: account.role });
      setState({ account, isLoading: false, error: null });

      return account;
    } catch (error) {
      setState({
        account: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось войти",
      });

      throw error;
    }
  }

  /** Сбрасывает результат входа, когда пользователь меняет реквизиты формы. */
  function reset(): void {
    setState(INITIAL_STATE);
  }

  return {
    ...state,
    signIn,
    reset,
  };
}
