import { FormEvent } from "react";
import { Input, Tabs } from "@/shared/ui";
import Button from "@/shared/ui/Button/Button";

interface LoginFormProps {
  login: string;
  password: string;
  role: "CUSTOMER" | "EXPERT";
  isLoading: boolean;
  error: string | null;
  fromOrder: boolean;
  onLoginChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (v: "CUSTOMER" | "EXPERT") => void;
  onSubmit: (e: FormEvent) => void;
  styles: Record<string, string>;
}

export function LoginForm({
  login,
  password,
  role,
  isLoading,
  error,
  fromOrder,
  onLoginChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
  styles,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      {!fromOrder && (
        <Tabs
          tabs={[
            { id: "CUSTOMER", label: "Заказчик" },
            { id: "EXPERT", label: "Эксперт" },
          ]}
          activeTab={role}
          onTabChange={(id) => onRoleChange(id as "CUSTOMER" | "EXPERT")}
          className={styles.loginTabs}
        />
      )}

      {fromOrder && (
        <p className={styles.orderHint}>Войдите как эксперт, чтобы откликнуться на заказ</p>
      )}

      <Input
        id="login"
        variant="emailOrPhone"
        value={login}
        onChange={(e) => onLoginChange(e.target.value)}
        placeholder="Электронная почта или телефон"
        required
      />

      <Input
        id="password"
        variant="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Введите пароль"
        required
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
