"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/shared/ui/icons";
import { useForgotPasswordState, EmailStep, CodeStep, NewPasswordStep, SuccessScreen } from "@/features/auth/forgot-password";
import styles from "./forgot-password.module.scss";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const state = useForgotPasswordState();

  useEffect(() => {
    if (state.step === 4) {
      const timer = setTimeout(() => router.push("/login"), 4000);
      return () => clearTimeout(timer);
    }
  }, [state.step, router]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        {state.step === 4 ? (
          <SuccessScreen styles={styles} />
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <Link href="/" className={styles.logo}>
                <LogoIcon title="Ресурс-Плюс" />
              </Link>
            </div>

            <h1 className={styles.title}>Восстановление пароля</h1>

            {state.step === 1 && (
              <EmailStep email={state.email} onChange={state.setEmail} onSubmit={(e) => { e.preventDefault(); state.setStep(2); }} styles={styles} />
            )}
            {state.step === 2 && (
              <CodeStep code={state.code} onChange={state.setCode} onSubmit={(e) => { e.preventDefault(); state.setStep(3); }} styles={styles} />
            )}
            {state.step === 3 && (
              <NewPasswordStep
                password={state.password}
                repeatPassword={state.repeatPassword}
                onPasswordChange={state.setPassword}
                onRepeatPasswordChange={state.setRepeatPassword}
                onSubmit={(e) => { e.preventDefault(); state.setStep(4); }}
                styles={styles}
              />
            )}

            {state.step === 1 && (
              <div className={styles.footer}>
                <Link href="/login" className={styles.link}>
                  Вернуться ко входу
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
