"use client";

import { useReducer } from "react";
import {
  confirmResetCode,
  requestPasswordReset,
  resetPassword,
} from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import {
  INITIAL_RESET_PASSWORD_STATE,
  resetPasswordReducer,
} from "./reducer";

const CODE_LENGTH = 6;

/** Ведёт форму восстановления через почту, код и новый пароль. */
export function useResetPassword(
  onBusyChange?: (isBusy: boolean) => void,
) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(
    resetPasswordReducer,
    INITIAL_RESET_PASSWORD_STATE,
  );

  /** Отправляет код на почту перед переходом к его вводу. */
  async function sendEmail() {
    if (state.isSubmitting || state.step !== "email") {
      return;
    }

    dispatch({ type: "request/started" });
    onBusyChange?.(true);

    try {
      await requestPasswordReset(state.email.trim());
      dispatch({ type: "email/sent" });
    } catch (error) {
      dispatch({ type: "request/failed" });
      showError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      onBusyChange?.(false);
    }
  }

  /** Проверяет код на сервере перед вводом нового пароля. */
  async function sendCode() {
    if (state.isSubmitting || state.step !== "code") {
      return;
    }

    if (state.code.length !== CODE_LENGTH) {
      showError(`Введите ${CODE_LENGTH}-значный код`);
      return;
    }

    dispatch({ type: "request/started" });
    onBusyChange?.(true);

    try {
      await confirmResetCode(state.email.trim(), state.code);
      dispatch({ type: "code/confirmed" });
    } catch (error) {
      dispatch({ type: "request/failed" });
      showError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      onBusyChange?.(false);
    }
  }

  /** Сохраняет совпадающие пароли и завершает восстановление. */
  async function sendPassword() {
    if (state.isSubmitting || state.step !== "password") {
      return;
    }

    if (state.password !== state.repeatPassword) {
      showError("Пароли не совпадают");
      return;
    }

    dispatch({ type: "request/started" });
    onBusyChange?.(true);

    try {
      await resetPassword(
        state.email.trim(),
        state.code,
        state.password,
      );
      dispatch({ type: "password/saved" });
    } catch (error) {
      dispatch({ type: "request/failed" });
      showError(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      onBusyChange?.(false);
    }
  }

  return {
    state,
    sendEmail,
    sendCode,
    sendPassword,
    changeEmail: (email: string) => {
      if (!state.isSubmitting) {
        dispatch({ type: "email/changed", email });
      }
    },
    changeCode: (code: string) => {
      if (!state.isSubmitting) {
        dispatch({ type: "code/changed", code });
      }
    },
    changePassword: (password: string) => {
      if (!state.isSubmitting) {
        dispatch({ type: "password/changed", password });
      }
    },
    changeRepeatPassword: (password: string) => {
      if (!state.isSubmitting) {
        dispatch({ type: "password-repeat/changed", password });
      }
    },
  };
}
