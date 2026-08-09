import type { FormEvent } from "react";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import s from "./NewPasswordStep.module.scss";

interface Props {
  password: string;
  repeatPassword: string;
  onPasswordChange: (value: string) => void;
  onRepeatPasswordChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
}

export function NewPasswordStep({
  password,
  repeatPassword,
  onPasswordChange,
  onRepeatPasswordChange,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <>
      <p className={s.stepText}>Шаг 3. Создание нового пароля</p>
      <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="forgot-password-new-password" />
        <PasswordInput
          id="password"
          value={password}
          required
          minLength={6}
          autoComplete="new-password"
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Пароль"
        />
        <PasswordInput
          id="repeatPassword"
          value={repeatPassword}
          required
          autoComplete="new-password"
          onChange={(e) => onRepeatPasswordChange(e.target.value)}
          placeholder="Повторите пароль"
        />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Сохранить изменения
        </Button>
      </form>
    </>
  );
}
