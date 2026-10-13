"use client";

import type { UserRole } from "@/source/entities/user";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Button from "@/source/shared/ui/Button";
import { EmailInput, PasswordInput } from "@/source/shared/ui/Inputs";
import { useLogin } from "../model/useLogin";
import { RoleChoice } from "./RoleChoice";
import s from "./LoginForm.module.scss";

interface LoginFormProps {
  onSuccess: () => void;
  onForgot: () => void;
  onUnverified: (email: string, role: UserRole | null) => void;
}

/** Форма входа: почта, пароль, «Забыли пароль?»; если ролей несколько — выбор роли вместо формы. */
export function LoginForm({ onSuccess, onForgot, onUnverified }: LoginFormProps) {
  const { state, changeEmail, changePassword, submit, chooseRole, cancelRoleChoice } = useLogin({
    onSuccess,
    onUnverified,
  });

  if (state.roles) {
    return (
      <RoleChoice roles={state.roles} isSubmitting={state.isSubmitting} onChoose={chooseRole} onCancel={cancelRoleChoice} />
    );
  }

  return (
    <div className={s.login}>
      <form onSubmit={submit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="login" />

        {state.fromOrder && <p className={s.orderHint}>Войдите как исполнитель, чтобы откликнуться на заказ</p>}

        <EmailInput
          id="login-email"
          value={state.email}
          required
          autoComplete="off"
          onChange={(event) => changeEmail(event.target.value)}
          placeholder="Электронная почта"
        />
        <PasswordInput
          id="login-password"
          value={state.password}
          required
          autoComplete="new-password"
          onChange={(event) => changePassword(event.target.value)}
          placeholder="Введите пароль"
        />

        <Button type="submit" variant="primary" fullWidth isLoading={state.isSubmitting}>
          Войти
        </Button>
      </form>

      <Button variant="transparent" size="sm" fullWidth onClick={onForgot}>
        Забыли пароль?
      </Button>
    </div>
  );
}
