import type { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import { EmailInput, PasswordInput } from "@/source/shared/ui/Inputs";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import s from "./LoginForm.module.scss";

interface Props {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  isLoading: boolean;
  fromOrder: boolean;
  onSubmit: (event: FormEvent) => void;
}

export function LoginForm({ email, password, onEmailChange, onPasswordChange, isLoading, fromOrder, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
      <AutofillGuard idPrefix="login" />

      {fromOrder && (
        <p className={s.orderHint}>Войдите как исполнитель, чтобы откликнуться на заказ</p>
      )}

      <EmailInput
        id="email"
        value={email}
        required
        autoComplete="off"
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Электронная почта"
      />
      <PasswordInput
        id="password"
        value={password}
        required
        autoComplete="new-password"
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Введите пароль"
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
