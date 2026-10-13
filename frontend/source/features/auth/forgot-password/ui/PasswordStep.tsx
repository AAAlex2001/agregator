import type { FormEvent } from "react";
import { PASSWORD_MIN_LENGTH, PasswordRequirements } from "@/source/entities/user";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Button from "@/source/shared/ui/Button";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import s from "./PasswordStep.module.scss";

interface PasswordStepProps {
  password: string;
  repeatPassword: string;
  isSubmitting: boolean;
  onPasswordChange: (password: string) => void;
  onRepeatPasswordChange: (password: string) => void;
  onSubmit: (event: FormEvent) => void;
}

/** Шаг 3: новый пароль, повтор и требования к паролю. */
export function PasswordStep({
  password,
  repeatPassword,
  isSubmitting,
  onPasswordChange,
  onRepeatPasswordChange,
  onSubmit,
}: PasswordStepProps) {
  return (
    <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
      <AutofillGuard idPrefix="forgot-password-new-password" />
      <p className={s.step}>Шаг 3. Придумайте новый пароль</p>
      <PasswordInput
        id="forgot-password-new"
        value={password}
        required
        minLength={PASSWORD_MIN_LENGTH}
        autoComplete="new-password"
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Пароль"
      />
      <PasswordInput
        id="forgot-password-repeat"
        value={repeatPassword}
        required
        autoComplete="new-password"
        onChange={(event) => onRepeatPasswordChange(event.target.value)}
        placeholder="Повторите пароль"
      />
      <PasswordRequirements password={password} />
      <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
        Сохранить пароль
      </Button>
    </form>
  );
}
