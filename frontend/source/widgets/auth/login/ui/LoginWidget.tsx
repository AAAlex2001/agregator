"use client";

import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import { useLogin, LoginForm } from "@/source/features/auth/login";
import styles from "./LoginWidget.module.scss";

export function LoginWidget() {
  const auth = useLogin();

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
            inn={auth.inn}
            password={auth.password}
            role={auth.role}
            isLoading={auth.isLoading}
            fromOrder={auth.fromOrder}
            onInnChange={auth.setInn}
            onPasswordChange={auth.setPassword}
            onRoleChange={auth.setRole}
            onSubmit={auth.handleSubmit}
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
