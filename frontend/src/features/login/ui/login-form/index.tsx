"use client";

import type { FormEvent } from "react";
import { AutofillGuard } from "@/shared/ui/autofill-guard";
import { Button } from "@/shared/ui/button";
import { EmailInput } from "@/shared/ui/email-input";
import { PasswordInput } from "@/shared/ui/password-input";
import type { LoginOptions } from "../../model/types";
import { useLoginForm } from "../../model/use-login-form";
import { RoleChoice } from "../role-choice";
import styles from "./style.module.scss";

interface LoginFormProps extends LoginOptions {
  fromOrder?: boolean;
  onForgot: () => void;
}

/** Показывает поля входа либо выбор роли для указанной почты. */
export function LoginForm({
  fromOrder = false,
  onForgot,
  onSuccess,
  onUnverified,
  onBusyChange,
}: LoginFormProps) {
  const form = useLoginForm({
    onSuccess,
    onUnverified,
    onBusyChange,
  });
  const { state } = form;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.submit();
  }

  if (state.availableRoles.length > 0) {
    return (
      <RoleChoice
        roles={state.availableRoles}
        isSubmitting={state.isSubmitting}
        onChoose={form.chooseRole}
        onCancel={form.cancelRoleChoice}
      />
    );
  }

  return (
    <div className={styles.login}>
      <form
        onSubmit={submit}
        className={styles.form}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
      >
        <AutofillGuard idPrefix="login" />

        {fromOrder && (
          <p className={styles.orderHint}>
            Войдите как исполнитель, чтобы откликнуться на заказ
          </p>
        )}

        <EmailInput
          id="login-email"
          value={state.email}
          required
          autoComplete="off"
          onChange={(event) => form.changeEmail(event.target.value)}
          placeholder="Электронная почта"
        />
        <PasswordInput
          id="login-password"
          value={state.password}
          required
          autoComplete="new-password"
          onChange={(event) => form.changePassword(event.target.value)}
          placeholder="Введите пароль"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={state.isSubmitting}
        >
          Войти
        </Button>
      </form>

      <Button
        variant="transparent"
        size="sm"
        fullWidth
        disabled={state.isSubmitting}
        onClick={onForgot}
      >
        Забыли пароль?
      </Button>
    </div>
  );
}
