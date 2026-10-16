"use client";

import { useReducer } from "react";
import { useConfirmEmail, useLoadUser, useResendConfirmationCode } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { INITIAL_CONFIRM_EMAIL_STATE, confirmEmailReducer } from "./reducer";
import type { ConfirmEmailOptions } from "./types";

/** Число цифр в коде из письма подтверждения. */
const CODE_LENGTH = 6;

/** Подтверждает почту и передаёт пользователя после загрузки открытой сессии. */
export function useConfirmEmailForm({
  email,
  role,
  onConfirmed,
  onBusyChange,
}: ConfirmEmailOptions) {
  const { loadUser } = useLoadUser();
  const confirmation = useConfirmEmail();
  const codeDelivery = useResendConfirmationCode();
  const { showError, showSuccess } = useNotifications();
  const [state, dispatch] = useReducer(confirmEmailReducer, INITIAL_CONFIRM_EMAIL_STATE);
  const isEmailConfirmed = confirmation.account !== null;
  const isBusy = state.isSubmitting || codeDelivery.isSending;

  /** После успешного подтверждения повторяет только загрузку профиля. */
  async function confirm() {
    if (isBusy) {
      return;
    }

    if (!isEmailConfirmed && state.code.length !== CODE_LENGTH) {
      showError(`Введите ${CODE_LENGTH}-значный код`);
      return;
    }

    dispatch({ type: "confirmation/started" });
    onBusyChange?.(true);

    try {
      if (!isEmailConfirmed) {
        await confirmation.confirm(email, state.code, role);
      }

      const user = await loadUser();

      if (!user) {
        throw new Error("Сессия недоступна. Закройте окно и войдите снова");
      }

      showSuccess("Почта подтверждена");
      onConfirmed(user);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Неверный код");
    } finally {
      dispatch({ type: "confirmation/finished" });
      onBusyChange?.(false);
    }
  }

  /** Запрашивает новое письмо, пока почта ещё не подтверждена. */
  async function resend() {
    if (isBusy || isEmailConfirmed) {
      return;
    }

    onBusyChange?.(true);

    try {
      await codeDelivery.sendCode(email, role);
      showSuccess("Код отправлен повторно");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить код");
    } finally {
      onBusyChange?.(false);
    }
  }

  /** Меняет код до подтверждения, пока форма свободна. */
  function changeCode(code: string) {
    if (isBusy || isEmailConfirmed) {
      return;
    }

    dispatch({
      type: "code/changed",
      code,
    });
  }

  return {
    state,
    isBusy,
    isEmailConfirmed,
    isResending: codeDelivery.isSending,
    confirm,
    resend,
    changeCode,
  };
}
