"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { homePath } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import type { RegistrationPreset } from "@/features/register";
import { useNotifications } from "@/shared/ui/notifications";
import { AuthModal } from "@/widgets/auth-modal";
import type { AuthTab } from "@/widgets/auth-modal";
import { isPostsPage } from "../../config/cabinet-routes";
import { forgetOrderToRespond, readOrderToRespond } from "../../session/order-to-respond";
import { AuthenticationContext } from "./context";

export { useAuthentication } from "./context";

/** Условия открытия формы из текущей страницы. */
interface AuthenticationDialog {
  tab: AuthTab;
  preset: RegistrationPreset | null;
  orderToRespond: string | null;
}

/** Страницы, которым доступно общее окно авторизации. */
interface AuthenticationProviderProps {
  children: ReactNode;
}

/** Открывает авторизацию и выполняет переход к нужной странице после её завершения. */
export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { showError } = useNotifications();
  const [dialog, setDialog] = useState<AuthenticationDialog | null>(null);

  /** Открывает выбранную форму и сохраняет заказ для возврата после входа. */
  function openDialog(tab: AuthTab, preset: RegistrationPreset | null) {
    setDialog({
      tab,
      preset,
      orderToRespond: readOrderToRespond(),
    });
  }

  /** Открывает форму входа. */
  function openLogin() {
    openDialog("login", null);
  }

  /** Открывает регистрацию с ролью и направлением выбранной услуги. */
  function openRegistration(preset?: RegistrationPreset) {
    openDialog("register", preset ?? null);
  }

  /** Закрывает окно и удаляет его локальные поля. */
  function close() {
    setDialog(null);
  }

  /** Возвращает исполнителя к заказу или открывает стартовую страницу его роли. */
  function finishLogin(user: UserProfile) {
    const orderToRespond = readOrderToRespond();

    forgetOrderToRespond();
    close();

    if (orderToRespond && user.role === "EXPERT") {
      router.push(`/order/${orderToRespond}`);
      return;
    }

    if (orderToRespond) {
      showError(
        "Этот аккаунт зарегистрирован под другой ролью. Для отклика нужен аккаунт исполнителя",
      );
    }

    if (isPostsPage(pathname)) {
      return;
    }

    router.push(homePath(user.role));
  }

  /** После подтверждения почты открывает настройки держателя или главную кабинета. */
  function finishConfirmation(user: UserProfile) {
    close();
    router.push(user.role === "LICENSE_HOLDER" ? "/settings" : "/landing");
  }

  return (
    <AuthenticationContext.Provider value={{ openLogin, openRegistration }}>
      {children}

      {dialog && (
        <AuthModal
          key={`${dialog.tab}:${dialog.preset?.role ?? ""}:${dialog.preset?.direction ?? ""}`}
          initialTab={dialog.tab}
          preset={dialog.preset}
          fromOrder={Boolean(dialog.orderToRespond)}
          onClose={close}
          onSignedIn={finishLogin}
          onConfirmed={finishConfirmation}
        />
      )}
    </AuthenticationContext.Provider>
  );
}
