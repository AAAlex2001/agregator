"use client";

import { useReducer } from "react";
import { useLoadUser, useSwitchAccountRole } from "@/entities/user";
import type { AvailableRole } from "@/entities/user";
import { INITIAL_SWITCH_ROLE_STATE, switchRoleReducer } from "./reducer";
import type { SwitchRoleFormOptions } from "./types";

/** Управляет выбором роли, паролем и отправкой формы переключения. */
export function useSwitchRole({
  onSwitched,
  onBusyChange,
}: SwitchRoleFormOptions) {
  const roleSwitch = useSwitchAccountRole();
  const { loadUser } = useLoadUser();
  const [state, dispatch] = useReducer(
    switchRoleReducer,
    INITIAL_SWITCH_ROLE_STATE,
  );
  const canRetryProfile = roleSwitch.account !== null;

  /** Подтверждает роль и загружает профиль; при повторе пароль уже не отправляется. */
  async function submit() {
    const { selectedRole, password, isSubmitting } = state;

    if (!selectedRole || isSubmitting || (!canRetryProfile && !password)) {
      return;
    }

    dispatch({ type: "request/started" });
    onBusyChange?.(true);

    try {
      if (!canRetryProfile) {
        await roleSwitch.switchAccountRole(selectedRole, password);
        dispatch({ type: "password/cleared" });
      }

      const user = await loadUser();

      if (!user) {
        roleSwitch.reset();
        throw new Error("Сессия недоступна. Закройте окно и войдите снова");
      }

      dispatch({ type: "form/closed" });
      onSwitched(user);
    } catch (error) {
      dispatch({
        type: "request/failed",
        error: error instanceof Error
          ? error.message
          : "Не удалось переключить роль",
      });
    } finally {
      dispatch({ type: "request/finished" });
      onBusyChange?.(false);
    }
  }

  /** Открывает форму для доступного аккаунта с подтверждённой почтой. */
  function selectRole(availableRole: AvailableRole) {
    if (state.isSubmitting || !availableRole.email_verified) {
      return;
    }

    roleSwitch.reset();
    dispatch({ type: "role/selected", role: availableRole.role });
  }

  /** Закрывает форму и очищает введённый пароль. */
  function cancel() {
    if (state.isSubmitting) {
      return;
    }

    roleSwitch.reset();
    dispatch({ type: "form/closed" });
  }

  /** Сохраняет введённый пароль в поле подтверждения роли. */
  function setPasswordInput(password: string) {
    if (state.isSubmitting || canRetryProfile) {
      return;
    }

    dispatch({ type: "password/changed", password });
  }

  return {
    state,
    canRetryProfile,
    submit,
    selectRole,
    cancel,
    setPasswordInput,
  };
}
