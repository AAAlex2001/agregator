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
        <EmailStep form={fp.emailForm} isLoading={fp.isEmailLoading} onSubmit={fp.submitEmail} />
      )}
      {fp.step === 2 && (
        <CodeStep form={fp.codeForm} isLoading={fp.isCodeLoading} onSubmit={fp.submitCode} />
      )}
      {fp.step === 3 && (
        <NewPasswordStep
          form={fp.passwordForm}
          isLoading={fp.isPasswordLoading}
          onSubmit={fp.submitPassword}
        />
      )}
    </div>
  );
}
