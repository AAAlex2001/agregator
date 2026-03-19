"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Tabs } from "@/app/components";
import { useNotifications } from "@/app/components/Notifications";
import Button from "@/app/components/Button/Button";
import { LogoIcon } from "@/app/icons";
import styles from "./login.module.scss";
import { handleLogin } from "./store/actions";
import { useLoginState } from "./store/state";

export default function LoginPage() {
  const router = useRouter();
  const state = useLoginState();
  const { showError } = useNotifications();
  const [fromOrder, setFromOrder] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingOrderUuid");
    if (pending) {
      setFromOrder(true);
      state.setRole("EXPERT");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    state.setIsLoading(true);
    state.setError(null);

    try {
      await handleLogin(
        { login: state.login, password: state.password, role: state.role },
        (role) => {
          const pendingUuid = sessionStorage.getItem("pendingOrderUuid");
          if (role === "EXPERT" && pendingUuid) {
            sessionStorage.removeItem("pendingOrderUuid");
            router.push(`/order/${pendingUuid}`);
          } else {
            router.push(role === "CUSTOMER" ? "/customer/orders" : "/expert/orders");
          }
        },
        (error) => {
          state.setError(error);
          showError(error);
        }
      );
    } finally {
      state.setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {state.error && <div className={styles.errorMessage}>{state.error}</div>}

            {!fromOrder && (
              <Tabs
                tabs={[
                  { id: "CUSTOMER", label: "Заказчик" },
                  { id: "EXPERT", label: "Эксперт" },
                ]}
                activeTab={state.role}
                onTabChange={(id) => state.setRole(id as "CUSTOMER" | "EXPERT")}
                className={styles.loginTabs}
              />
            )}

            {fromOrder && (
              <p className={styles.orderHint}>Войдите как эксперт, чтобы откликнуться на заказ</p>
            )}

            <Input
              id="login"
              variant="emailOrPhone"
              value={state.login}
              onChange={(e) => state.setLogin(e.target.value)}
              placeholder="Электронная почта или телефон"
              required
            />

            <Input
              id="password"
              variant="password"
              value={state.password}
              onChange={(e) => state.setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />

            <Button type="submit" variant="primary" fullWidth isLoading={state.isLoading}>
              Войти
            </Button>
          </form>

          <div className={styles.footer}>
            <p>
              Нет аккаунта?{" "}
              <Link href="/register" className={styles.link}>
                Зарегистрироваться
              </Link>
            </p>
            <p>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Забыли пароль?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
