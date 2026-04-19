import { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import Tabs from "@/source/shared/ui/Tabs";
import type { UserRole } from "../model/types";
import s from "./LoginForm.module.scss";

interface Props {
  inn: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  fromOrder: boolean;
  onInnChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (role: UserRole) => void;
  onSubmit: (e: FormEvent) => void;
}

export function LoginForm({
  inn, password, role, isLoading, error, fromOrder,
  onInnChange, onPasswordChange, onRoleChange, onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={s.form}>
      {error && <div className={s.errorMessage}>{error}</div>}

      {!fromOrder && (
        <Tabs
          tabs={[
            { id: "CUSTOMER", label: "Заказчик" },
            { id: "EXPERT", label: "Эксперт" },
          ]}
          activeTab={role}
          onTabChange={(id) => onRoleChange(id as UserRole)}
          className={s.loginTabs}
        />
      )}

      {fromOrder && (
        <p className={s.orderHint}>Войдите как эксперт, чтобы откликнуться на заказ</p>
      )}

      <Input
        id="inn"
        variant="text"
        value={inn}
        onChange={(event) => onInnChange(event.target.value)}
        placeholder="ИНН"
        inputMode="numeric"
        required
        disabled={isLoading}
      />
      <Input id="password" variant="password" value={password}
        onChange={(e) => onPasswordChange(e.target.value)} placeholder="Введите пароль" required />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
