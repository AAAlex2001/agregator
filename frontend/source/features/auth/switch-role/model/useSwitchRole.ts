"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { fetchAvailableRoles, homePath, switchRole, useSession } from "@/source/entities/session";
import type { UserRole } from "@/source/entities/user";
import { INITIAL_STATE, switchRoleReducer } from "./reducer";

/** Переключение на другую роль того же пользователя: список ролей, пароль от выбранной и переход в её кабинет. */
export function useSwitchRole() {
  const router = useRouter();
  const { role, reload } = useSession();
  const [state, dispatch] = useReducer(switchRoleReducer, INITIAL_STATE);

  useEffect(() => {
    if (!role) return;
    let cancelled = false;
    fetchAvailableRoles()
      .then((roles) => {
        if (!cancelled) dispatch({ type: "roles/loaded", roles });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [role]);

  const submit = async () => {
    const target = state.target;
    if (!target || !state.password) return;
    dispatch({ type: "submit/start" });
    try {
      await switchRole(target, state.password);
      dispatch({ type: "target/cancel" });
      await reload();
      router.push(homePath(target));
    } catch (error) {
      dispatch({ type: "submit/error", error: error instanceof Error ? error.message : "Не удалось переключить роль" });
    }
  };

  return {
    state,
    pick: (next: UserRole) => dispatch({ type: "target/pick", role: next }),
    cancel: () => dispatch({ type: "target/cancel" }),
    changePassword: (password: string) => dispatch({ type: "password/change", password }),
    submit,
  };
}
