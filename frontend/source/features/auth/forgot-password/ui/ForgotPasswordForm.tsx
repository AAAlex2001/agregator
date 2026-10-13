"use client";

import Button from "@/source/shared/ui/Button";
import { useForgotPassword } from "../model/useForgotPassword";
import { CodeStep } from "./CodeStep";
import { DoneStep } from "./DoneStep";
import { EmailStep } from "./EmailStep";
import { PasswordStep } from "./PasswordStep";
import s from "./ForgotPasswordForm.module.scss";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

/** Восстановление пароля: три шага и экран «готово». */
export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const form = useForgotPassword();
  const { state } = form;

  if (state.step === "done") return <DoneStep onBackToLogin={onBackToLogin} />;

  return (
    <div className={s.flow}>
      <Button variant="transparent" size="sm" className={s.back} onClick={onBackToLogin}>
        Назад ко входу
      </Button>
      <h2 className={s.title}>Восстановление пароля</h2>

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
