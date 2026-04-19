import { FormEvent } from "react";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import s from "./NewPasswordStep.module.scss";

interface Props {
  password: string;
  repeatPassword: string;
  isLoading: boolean;
  onPasswordChange: (v: string) => void;
  onRepeatPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function NewPasswordStep({
  password, repeatPassword, isLoading,
  onPasswordChange, onRepeatPasswordChange, onSubmit,
}: Props) {
  const disabled = !password.trim() || !repeatPassword.trim();

  return (
    <>
      <p className={s.stepText}>Шаг 3. Создание нового пароля</p>
      <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="forgot-password-new-password" />
        <Input id="password" name="forgot-password-new-password" variant="password" value={password}
          autoComplete="new-password"
          onChange={(e) => onPasswordChange(e.target.value)} placeholder="Пароль" required />
        <Input id="repeatPassword" name="forgot-password-repeat-password" variant="password" value={repeatPassword}
          autoComplete="new-password"
          onChange={(e) => onRepeatPasswordChange(e.target.value)} placeholder="Повторите пароль" required />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading} disabled={disabled}>
          Сохранить изменения
        </Button>
      </form>
    </>
  );
}
