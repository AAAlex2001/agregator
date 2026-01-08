"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/app/components";
import { LogoIcon } from "@/app/icons";
import styles from "./login.module.scss";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Вход:", { login, password });
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
            <Input
              id="login"
              variant="emailOrPhone"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Электронная почта или телефон"
              required
            />

            <Input
              id="password"
              variant="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />

            <button type="submit" className={styles.submitButton}>
              Войти
            </button>
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

