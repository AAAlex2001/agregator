import { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import Tabs from "@/source/shared/ui/Tabs";
import type { UserRole } from "../model/types";
import s from "./LoginForm.module.scss";

interface Props {
  login: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  fromOrder: boolean;
  onLoginChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (role: UserRole) => void;
  onSubmit: (e: FormEvent) => void;
}

export function LoginForm({
  login, password, role, isLoading, error, fromOrder,
  onLoginChange, onPasswordChange, onRoleChange, onSubmit,
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

      <Input id="login" variant="emailOrPhone" value={login}
        onChange={(e) => onLoginChange(e.target.value)} placeholder="Электронная почта или телефон" required />
      <Input id="password" variant="password" value={password}
        onChange={(e) => onPasswordChange(e.target.value)} placeholder="Введите пароль" required />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
