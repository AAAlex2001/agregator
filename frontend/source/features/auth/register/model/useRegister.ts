"use client";

import { useReducer, type FormEvent } from "react";
import { clearReferralCode } from "@/source/entities/referral";
import type { UserRole } from "@/source/entities/user";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { initRegisterState, registerReducer } from "./reducer";
import { submitRegister, validateRegister } from "./submit";

/** Форма регистрации: одно состояние на все роли, отправка под выбранную роль. */
export function useRegister(preset: AuthPreset | null, onRegistered: (email: string, role: UserRole) => void) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(registerReducer, preset, initRegisterState);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.isSubmitting) return;
    if (!event.currentTarget.checkValidity()) {
      showError("Заполните обязательные поля");
      event.currentTarget.reportValidity();
      return;
    }
    const problem = validateRegister(state);
    if (problem) {
      showError(problem);
      return;
    }

    dispatch({ type: "submit/start" });
    try {
      await submitRegister(state);
      clearReferralCode();
      onRegistered(state.email.trim(), state.role);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось зарегистрироваться");
    } finally {
      dispatch({ type: "submit/finish" });
    }
  };

  return { state, dispatch, submit };
}
