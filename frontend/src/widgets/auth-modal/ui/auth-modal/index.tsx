"use client";

import { useState } from "react";
import type { UserProfile, UserRole } from "@/entities/user";
import { ConfirmEmailForm } from "@/features/confirm-email";
import { LoginForm } from "@/features/login";
import { RegisterForm } from "@/features/register";
import type { RegistrationPreset } from "@/features/register";
import { ResetPasswordForm } from "@/features/reset-password";
import { Modal } from "@/shared/ui/modal";
import { Tabs } from "@/shared/ui/tabs";
import styles from "./style.module.scss";

/** Начальная вкладка окна авторизации. */
export type AuthTab = "login" | "register";

/** Текущая форма внутри окна авторизации. */
type AuthView =
  | { kind: "tabs" }
  | { kind: "password-reset" }
  | { kind: "email-confirmation"; email: string; role: UserRole | null };

/** Начальные условия окна и действия страницы после успешной авторизации. */
interface AuthModalProps {
  initialTab: AuthTab;
  preset: RegistrationPreset | null;
  fromOrder?: boolean;
  onClose: () => void;
  onSignedIn: (user: UserProfile) => void;
  onConfirmed: (user: UserProfile) => void;
}

/** Вкладки входа и регистрации в существующем окне авторизации. */
const AUTH_TABS = [
  { id: "login", label: "Вход" },
  { id: "register", label: "Регистрация" },
];

/** Собирает готовые формы и переключает их внутри одного окна. */
export function AuthModal({
  initialTab,
  preset,
  fromOrder = false,
  onClose,
  onSignedIn,
  onConfirmed,
}: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(preset ? "register" : initialTab);
  const [view, setView] = useState<AuthView>({ kind: "tabs" });
  const [isBusy, setIsBusy] = useState(false);

  /** Меняет вкладку, когда форма не выполняет запрос. */
  function changeTab(nextTab: string) {
    if (!isBusy && (nextTab === "login" || nextTab === "register")) {
      setTab(nextTab);
    }
  }

  /** Открывает подтверждение адреса после регистрации или попытки входа. */
  function showEmailConfirmation(email: string, role: UserRole | null) {
    setView({ kind: "email-confirmation", email, role });
  }

  /** Открывает форму восстановления пароля. */
  function showPasswordReset() {
    setView({ kind: "password-reset" });
  }

  /** Возвращает окно к форме входа. */
  function showLogin() {
    setTab("login");
    setView({ kind: "tabs" });
  }

  return (
    <Modal
      open
      isBusy={isBusy}
      onClose={onClose}
      size="md"
      ariaLabel="Авторизация"
      dialogClassName={styles.dialog}
    >
      {view.kind === "tabs" && !preset && (
        <Tabs
          tabs={AUTH_TABS}
          activeTab={tab}
          onTabChange={changeTab}
          disabled={isBusy}
          className={styles.tabs}
        />
      )}

      <div className={styles.body}>
        {view.kind === "email-confirmation" && (
          <ConfirmEmailForm
            key={`${view.email}:${view.role ?? ""}`}
            email={view.email}
            role={view.role}
            onConfirmed={onConfirmed}
            onBusyChange={setIsBusy}
          />
        )}

        {view.kind === "password-reset" && (
          <ResetPasswordForm
            onBackToLogin={showLogin}
            onBusyChange={setIsBusy}
          />
        )}

        {view.kind === "tabs" && tab === "login" && (
          <LoginForm
            fromOrder={fromOrder}
            onSuccess={onSignedIn}
            onForgot={showPasswordReset}
            onUnverified={showEmailConfirmation}
            onBusyChange={setIsBusy}
          />
        )}

        {view.kind === "tabs" && tab === "register" && (
          <RegisterForm
            preset={preset}
            onRegistered={showEmailConfirmation}
            onBusyChange={setIsBusy}
          />
        )}
      </div>
    </Modal>
  );
}
