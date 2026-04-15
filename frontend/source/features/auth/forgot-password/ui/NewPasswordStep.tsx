import { FormEvent } from "react";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
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
      <form onSubmit={onSubmit} className={s.form}>
        <Input id="password" variant="password" value={password}
          onChange={(e) => onPasswordChange(e.target.value)} placeholder="Пароль" required />
        <Input id="repeatPassword" variant="password" value={repeatPassword}
          onChange={(e) => onRepeatPasswordChange(e.target.value)} placeholder="Повторите пароль" required />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading} disabled={disabled}>
          Сохранить изменения
        </Button>
      </form>
    </>
  );
}
