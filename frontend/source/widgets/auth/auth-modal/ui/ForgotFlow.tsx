"use client";

import {
  useForgotPassword,
  EmailStep,
  CodeStep,
  NewPasswordStep,
  SuccessScreen,
} from "@/source/features/auth/forgot-password";
import Button from "@/source/shared/ui/Button";
import s from "./auth-modal.module.scss";

interface Props {
  onBack: () => void;
}

export function ForgotFlow({ onBack }: Props) {
  const fp = useForgotPassword();

  if (fp.step === 4) {
    return (
      <div className={s.flow}>
        <SuccessScreen />
        <Button variant="transparent" size="sm" className={s.centerLink} onClick={onBack}>
          Вернуться ко входу
        </Button>
      </div>
    );
  }

  return (
    <div className={s.flow}>
      <Button variant="transparent" size="sm" className={s.startLink} onClick={onBack}>
        Назад ко входу
      </Button>

      <h2 className={s.flowTitle}>Восстановление пароля</h2>

      {fp.step === 1 && (
        <EmailStep
          email={fp.email}
          onEmailChange={fp.setEmail}
          isLoading={fp.waiting}
          onSubmit={fp.submitEmail}
        />
      )}
      {fp.step === 2 && (
        <CodeStep
          code={fp.code}
          onCodeChange={fp.setCode}
          isLoading={fp.waiting}
          onSubmit={fp.submitCode}
        />
      )}
      {fp.step === 3 && (
        <NewPasswordStep
          password={fp.password}
          repeatPassword={fp.repeatPassword}
          onPasswordChange={fp.setPassword}
          onRepeatPasswordChange={fp.setRepeatPassword}
          isLoading={fp.waiting}
          onSubmit={fp.submitPassword}
        />
      )}
    </div>
  );
}
