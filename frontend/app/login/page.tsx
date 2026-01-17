"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components";
import Button from "@/app/components/Button/Button";
import { LogoIcon } from "@/app/icons";
import styles from "./login.module.scss";
import { handleLogin } from "./store/actions";
import { useLoginState } from "./store/state";

export default function LoginPage() {
  const router = useRouter();
  const state = useLoginState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    state.setIsLoading(true);
    state.setError(null);

    try {
      await handleLogin(
        { login: state.login, password: state.password },
        () => {
          router.push("/settings");
        },
        (error) => {
          state.setError(error);
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

