"use client";

import { useReducer } from "react";
import {
  EmailNotVerifiedError,
  RoleChoiceRequiredError,
  useLoadUser,
  useSignIn,
} from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { INITIAL_LOGIN_STATE, loginReducer } from "./reducer";
import type { LoginOptions } from "./types";

/** Отправляет поля входа, предлагает роль и передаёт загруженного пользователя. */
export function useLoginForm({
  onSuccess,
  onUnverified,
  onBusyChange,
}: LoginOptions) {
  const signIn = useSignIn();
  const profile = useLoadUser();
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(loginReducer, INITIAL_LOGIN_STATE);

  /** После успешного входа повторяет только загрузку профиля. */
  async function submit(role?: UserRole) {
    if (state.isSubmitting) {
      return;
    }

    dispatch({ type: "request/started" });
    onBusyChange?.(true);

    try {
      if (!signIn.account || (role && role !== signIn.account.role)) {
        await signIn.signIn({
          email: state.email.trim(),
          password: state.password,
          role,
        });
      }

      const user = await profile.loadUser();

      if (!user) {
        signIn.reset();
        throw new Error("Сессия недоступна. Закройте окно и войдите снова");
      }

      onSuccess(user);
    } catch (error) {
      if (error instanceof RoleChoiceRequiredError) {
        dispatch({ type: "role/required", roles: error.roles });
      } else if (error instanceof EmailNotVerifiedError) {
        onUnverified(error.email, error.role);
      } else {
        showError(error instanceof Error ? error.message : "Не удалось войти");
      }
    } finally {
      dispatch({ type: "request/finished" });
      onBusyChange?.(false);
    }
  }

  return {
    state,
    changeEmail: (email: string) => {
      if (state.isSubmitting) return;
      signIn.reset();
      dispatch({ type: "email/changed", email });
    },
    changePassword: (password: string) => {
      if (state.isSubmitting) return;
      signIn.reset();
      dispatch({ type: "password/changed", password });
    },
    submit: () => submit(),
    chooseRole: (role: UserRole) => {
      if (state.availableRoles.includes(role)) {
        void submit(role);
      }
    },
    cancelRoleChoice: () => {
      if (state.isSubmitting) return;
      signIn.reset();
      dispatch({ type: "role/cancelled" });
    },
  };
}
