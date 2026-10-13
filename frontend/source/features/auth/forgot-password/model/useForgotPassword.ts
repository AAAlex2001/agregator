"use client";

import { useReducer, type FormEvent } from "react";
import { confirmResetCode, requestPasswordReset, resetPassword } from "@/source/entities/user";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATE, forgotPasswordReducer } from "./reducer";
import type { ForgotPasswordStep } from "./types";

export const CODE_LENGTH = 6;

/** Восстановление пароля в три шага: почта, код из письма, новый пароль. */
export function useForgotPassword() {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(forgotPasswordReducer, INITIAL_STATE);
  const email = state.email.trim();

  const submit = async (request: () => Promise<void>, next: ForgotPasswordStep) => {
    dispatch({ type: "submit/start" });
    try {
      await request();
      dispatch({ type: "submit/success", step: next });
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Произошла ошибка");
    }
  };

  const sendEmail = (event: FormEvent) => {
    event.preventDefault();
    submit(() => requestPasswordReset(email), "code");
  };

  const sendCode = (event: FormEvent) => {
    event.preventDefault();
    if (state.code.length !== CODE_LENGTH) {
      showError(`Введите ${CODE_LENGTH}-значный код`);
      return;
    }
    submit(() => confirmResetCode(email, state.code), "password");
  };

  const sendPassword = (event: FormEvent) => {
    event.preventDefault();
    if (state.password !== state.repeatPassword) {
      showError("Пароли не совпадают");
      return;
    }
    submit(() => resetPassword(email, state.code, state.password), "done");
  };

  return {
    state,
    changeEmail: (value: string) => dispatch({ type: "email/change", email: value }),
    changeCode: (value: string) => dispatch({ type: "code/change", code: value }),
    changePassword: (value: string) => dispatch({ type: "password/change", password: value }),
    changeRepeatPassword: (value: string) => dispatch({ type: "repeatPassword/change", repeatPassword: value }),
    sendEmail,
    sendCode,
    sendPassword,
  };
}
