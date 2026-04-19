import { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import Tabs from "@/source/shared/ui/Tabs";
import type { UserRole } from "../model/types";
import { InnCodeInput } from "./InnCodeInput";
import s from "./LoginForm.module.scss";

interface Props {
  inn: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  fromOrder: boolean;
  onInnChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (role: UserRole) => void;
  onSubmit: (e: FormEvent) => void;
}

export function LoginForm({
  inn, password, role, isLoading, fromOrder,
  onInnChange, onPasswordChange, onRoleChange, onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={s.form}>
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

      <InnCodeInput value={inn} onChange={onInnChange} disabled={isLoading} />
      <Input id="password" variant="password" value={password}
        onChange={(e) => onPasswordChange(e.target.value)} placeholder="Введите пароль" required />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
