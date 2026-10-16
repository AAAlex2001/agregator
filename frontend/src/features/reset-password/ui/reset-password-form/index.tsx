"use client";

import { Button } from "@/shared/ui/button";
import { useResetPassword } from "../../model/use-reset-password";
import { CodeStep } from "../code-step";
import { DoneStep } from "../done-step";
import { EmailStep } from "../email-step";
import { PasswordStep } from "../password-step";
import styles from "./style.module.scss";

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
  onBusyChange?: (isBusy: boolean) => void;
}

/** Собирает последовательные шаги восстановления пароля. */
export function ResetPasswordForm({
  onBackToLogin,
  onBusyChange,
}: ResetPasswordFormProps) {
  const form = useResetPassword(onBusyChange);
  const { state } = form;

  if (state.step === "done") {
    return <DoneStep onBackToLogin={onBackToLogin} />;
  }

  return (
    <div className={styles.flow}>
      <Button
        variant="transparent"
        size="sm"
        className={styles.back}
        disabled={state.isSubmitting}
        onClick={onBackToLogin}
      >
        Назад ко входу
      </Button>
      <h2 className={styles.title}>Восстановление пароля</h2>

      {state.step === "email" && (
        <EmailStep
          email={state.email}
          isSubmitting={state.isSubmitting}
          onEmailChange={form.changeEmail}
          onSubmit={form.sendEmail}
        />
      )}
      {state.step === "code" && (
        <CodeStep
          code={state.code}
          isSubmitting={state.isSubmitting}
          onCodeChange={form.changeCode}
          onSubmit={form.sendCode}
        />
      )}
      {state.step === "password" && (
        <PasswordStep
          password={state.password}
          repeatPassword={state.repeatPassword}
          isSubmitting={state.isSubmitting}
          onPasswordChange={form.changePassword}
          onRepeatPasswordChange={form.changeRepeatPassword}
          onSubmit={form.sendPassword}
        />
      )}
    </div>
  );
}
