"use client";

import { useReducer, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/source/entities/session";
import { confirmEmail, resendConfirmationCode, type UserRole } from "@/source/entities/user";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATE, confirmEmailReducer } from "./reducer";

export const CODE_LENGTH = 6;

/** Подтверждение почты кодом из письма: после подтверждения сервер открывает сессию, отправляем в кабинет. */
export function useConfirmEmail(email: string, role: UserRole | null, onConfirmed: () => void) {
  const router = useRouter();
  const { reload } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [state, dispatch] = useReducer(confirmEmailReducer, INITIAL_STATE);

  const confirm = async (event: FormEvent) => {
    event.preventDefault();
    if (state.code.length !== CODE_LENGTH) {
      showError(`Введите ${CODE_LENGTH}-значный код`);
      return;
    }

    dispatch({ type: "submit/start" });
    try {
      await confirmEmail(email, state.code, role);
      await reload();
      showSuccess("Почта подтверждена");
      onConfirmed();
      router.push(role === "LICENSE_HOLDER" ? "/settings" : "/landing");
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Неверный код");
    }
  };

  const resend = async () => {
    dispatch({ type: "resend/start" });
    try {
      await resendConfirmationCode(email, role);
      showSuccess("Код отправлен повторно");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить код");
    } finally {
      dispatch({ type: "resend/finish" });
    }
  };

  return { state, changeCode: (code: string) => dispatch({ type: "code/change", code }), confirm, resend };
}
