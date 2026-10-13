"use client";

import { useReducer, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PENDING_ORDER_UUID_KEY } from "@/source/entities/order";
import { EmailNotVerifiedError, RoleChoiceRequiredError, homePath, login, useSession } from "@/source/entities/session";
import type { UserRole } from "@/source/entities/user";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { initialLoginState, loginReducer } from "./reducer";

interface UseLoginOptions {
  onSuccess: () => void;
  onUnverified: (email: string, role: UserRole | null) => void;
}

/** Вход. Если на почту несколько ролей — просит выбрать роль, если почта не подтверждена — отдаёт её на подтверждение. */
export function useLogin({ onSuccess, onUnverified }: UseLoginOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { reload } = useSession();
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(loginReducer, undefined, initialLoginState);

  const enter = async (role: UserRole) => {
    await reload();
    onSuccess();

    const pendingOrder = sessionStorage.getItem(PENDING_ORDER_UUID_KEY);
    sessionStorage.removeItem(PENDING_ORDER_UUID_KEY);
    if (pendingOrder && role === "EXPERT") {
      router.push(`/order/${pendingOrder}`);
      return;
    }
    if (pendingOrder) showError("Этот аккаунт зарегистрирован под другой ролью. Для отклика нужен аккаунт исполнителя");
    if (pathname === "/posts" || pathname.startsWith("/posts/")) return;
    router.push(homePath(role));
  };

  const send = async (role?: UserRole) => {
    dispatch({ type: "submit/start" });
    try {
      const response = await login({ email: state.email.trim(), password: state.password, role });
      await enter(response.role);
    } catch (error) {
      if (error instanceof RoleChoiceRequiredError) {
        dispatch({ type: "roles/required", roles: error.roles });
        return;
      }
      if (error instanceof EmailNotVerifiedError) onUnverified(error.email, error.role);
      else showError(error instanceof Error ? error.message : "Не удалось войти");
    } finally {
      dispatch({ type: "submit/finish" });
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send();
  };

  return {
    state,
    changeEmail: (value: string) => dispatch({ type: "email/change", email: value }),
    changePassword: (value: string) => dispatch({ type: "password/change", password: value }),
    submit,
    chooseRole: (role: UserRole) => send(role),
    cancelRoleChoice: () => dispatch({ type: "roles/cancel" }),
  };
}
