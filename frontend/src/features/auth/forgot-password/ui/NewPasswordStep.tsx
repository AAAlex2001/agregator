import { FormEvent } from "react";
import { Input } from "@/shared/ui";

interface NewPasswordStepProps {
  password: string;
  repeatPassword: string;
  onPasswordChange: (v: string) => void;
  onRepeatPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  styles: Record<string, string>;
}

export function NewPasswordStep({
  password,
  repeatPassword,
  onPasswordChange,
  onRepeatPasswordChange,
  onSubmit,
  styles,
}: NewPasswordStepProps) {
  const disabled = !password.trim() || !repeatPassword.trim();
  return (
    <>
      <p className={styles.stepText}>Шаг 3. Создание нового пароля</p>
      <form onSubmit={onSubmit} className={styles.form}>
        <Input id="password" variant="password" value={password}
          onChange={(e) => onPasswordChange(e.target.value)} placeholder="Пароль" required />
        <Input id="repeatPassword" variant="password" value={repeatPassword}
          onChange={(e) => onRepeatPasswordChange(e.target.value)} placeholder="Повторите пароль" required />
        <button type="submit" className={styles.submitButton} disabled={disabled}>
          Сохранить изменения
        </button>
      </form>
    </>
  );
}
