"use client";

import { useReducer } from "react";
import {
  useConfirmEmailChange,
  useRequestEmailChange,
} from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { changeEmailReducer, INITIAL_CHANGE_EMAIL_STATE } from "./reducer";
import { EMAIL_CHANGE_CODE_LENGTH } from "./types";
import type { ChangeEmailForm } from "./types";

/** Управляет двумя шагами смены почты и показывает ошибки рядом с полями. */
export function useChangeEmailForm(): ChangeEmailForm {
  const [state, dispatch] = useReducer(
    changeEmailReducer,
    INITIAL_CHANGE_EMAIL_STATE,
  );
  const request = useRequestEmailChange();
  const confirmation = useConfirmEmailChange();
  const { showSuccess } = useNotifications();
  const isPending = request.isSending || confirmation.isConfirming;

  /** Открывает окно с пустым новым адресом. */
  function open() {
    dispatch({
      type: "dialog/open",
    });
  }

  /** Закрывает окно, если запрос уже завершён. */
  function close() {
    if (!isPending) {
      dispatch({
        type: "dialog/close",
      });
    }
  }

  /** Обновляет новый адрес и убирает ошибку предыдущей попытки. */
  function changeEmail(email: string) {
    dispatch({
      type: "email/change",
      email,
    });
  }

  /** Обновляет код подтверждения из письма. */
  function changeCode(code: string) {
    dispatch({
      type: "code/change",
      code,
    });
  }

  /** Отправляет код на новый адрес и открывает шаг подтверждения. */
  async function sendCode() {
    if (isPending || !state.email.trim()) {
      return;
    }

    dispatch({
      type: "request/start",
    });

    try {
      await request.sendCode(state.email.trim());
      dispatch({
        type: "code/sent",
      });
    } catch (error) {
      dispatch({
        type: "request/failure",
        error: error instanceof Error ? error.message : "Не удалось отправить код",
      });
    }
  }

  /** Подтверждает новый адрес и закрывает окно после успешного сохранения. */
  async function confirm() {
    if (isPending || state.code.length < EMAIL_CHANGE_CODE_LENGTH) {
      return;
    }

    dispatch({
      type: "request/start",
    });

    try {
      await confirmation.confirm(state.code.trim());
      dispatch({
        type: "dialog/close",
      });
      showSuccess("Почта изменена");
    } catch (error) {
      dispatch({
        type: "request/failure",
        error:
          error instanceof Error ? error.message : "Не удалось подтвердить код",
      });
    }
  }

  return {
    state,
    isPending,
    open,
    close,
    changeEmail,
    changeCode,
    sendCode,
    confirm,
  };
}
