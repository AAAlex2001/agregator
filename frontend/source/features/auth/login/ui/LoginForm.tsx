import { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import { InnCodeInput } from "./InnCodeInput";
import s from "./LoginForm.module.scss";

interface Props {
  inn: string;
  password: string;
  isLoading: boolean;
  fromOrder: boolean;
  onInnChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function LoginForm({
  inn, password, isLoading, fromOrder,
  onInnChange, onPasswordChange, onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
      <AutofillGuard idPrefix="login" />

      {fromOrder && (
        <p className={s.orderHint}>Войдите как эксперт, чтобы откликнуться на заказ</p>
      )}

      <InnCodeInput value={inn} onChange={onInnChange} disabled={isLoading} />
      <Input id="password" name="login-auth-secret" variant="password" value={password}
        autoComplete="new-password"
        onChange={(e) => onPasswordChange(e.target.value)} placeholder="Введите пароль" required />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
