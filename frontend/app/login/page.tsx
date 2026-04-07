"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/shared/ui/Notifications";
import { LogoIcon } from "@/shared/ui/icons";
import { useLoginState, handleLogin, LoginForm } from "@/features/auth/login";
import styles from "./login.module.scss";

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
        },
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

          <LoginForm
            login={state.login}
            password={state.password}
            role={state.role}
            isLoading={state.isLoading}
            error={state.error}
            fromOrder={fromOrder}
            onLoginChange={state.setLogin}
            onPasswordChange={state.setPassword}
            onRoleChange={state.setRole}
            onSubmit={handleSubmit}
            styles={styles}
          />

          <div className={styles.footer}>
            <p>
              Нет аккаунта?{" "}
              <Link href="/register" className={styles.link}>Зарегистрироваться</Link>
            </p>
            <p>
              <Link href="/forgot-password" className={styles.forgotLink}>Забыли пароль?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
