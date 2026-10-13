"use client";

import { useState } from "react";
import type { UserRole } from "@/source/entities/user";
import { ConfirmEmailForm } from "@/source/features/auth/confirm-email";
import { ForgotPasswordForm } from "@/source/features/auth/forgot-password";
import { LoginForm } from "@/source/features/auth/login";
import { RegisterForm } from "@/source/features/auth/register";
import type { AuthPreset, AuthTab } from "@/source/shared/lib/auth-modal";
import { Modal } from "@/source/shared/ui/Modal";
import Tabs from "@/source/shared/ui/Tabs";
import s from "./AuthModal.module.scss";

type AuthView = { kind: "tabs" } | { kind: "forgot" } | { kind: "confirm"; email: string; role: UserRole | null };

const TABS = [
  { id: "login", label: "Вход" },
  { id: "register", label: "Регистрация" },
];

interface AuthModalProps {
  initialTab: AuthTab;
  preset: AuthPreset | null;
  onClose: () => void;
}

/** Окно входа и регистрации; внутри него же восстановление пароля и подтверждение почты. */
export function AuthModal({ initialTab, preset, onClose }: AuthModalProps) {
  const [tab, setTab] = useState(initialTab);
  const [view, setView] = useState<AuthView>({ kind: "tabs" });

  const toConfirm = (email: string, role: UserRole | null) => setView({ kind: "confirm", email, role });

  return (
    <Modal open onClose={onClose} size="md" ariaLabel="Авторизация" dialogClassName={s.dialog}>
      {view.kind === "tabs" && !preset && (
        <Tabs
          variant="squared"
          tabs={TABS}
          activeTab={tab}
          onTabChange={(id) => setTab(id as AuthTab)}
          className={s.tabs}
        />
      )}

      <div className={s.body}>
        {view.kind === "confirm" && <ConfirmEmailForm email={view.email} role={view.role} onConfirmed={onClose} />}
        {view.kind === "forgot" && <ForgotPasswordForm onBackToLogin={() => setView({ kind: "tabs" })} />}
        {view.kind === "tabs" &&
          (tab === "login" ? (
            <LoginForm onSuccess={onClose} onForgot={() => setView({ kind: "forgot" })} onUnverified={toConfirm} />
          ) : (
            <RegisterForm preset={preset} onRegistered={toConfirm} />
          ))}
      </div>
    </Modal>
  );
}
