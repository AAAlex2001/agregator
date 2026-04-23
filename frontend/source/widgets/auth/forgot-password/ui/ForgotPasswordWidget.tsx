"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import {
  useForgotPassword,
  EmailStep,
  CodeStep,
  NewPasswordStep,
  SuccessScreen,
} from "@/source/features/auth/forgot-password";
import styles from "./ForgotPasswordWidget.module.scss";

export function ForgotPasswordWidget() {
  const router = useRouter();
  const fp = useForgotPassword();

  useEffect(() => {
    if (fp.step === 4) {
      const timer = setTimeout(() => router.push("/login"), 4000);
      return () => clearTimeout(timer);
    }
  }, [fp.step, router]);

  if (fp.step === 4) return <SuccessScreen />;

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

          <h1 className={styles.title}>Восстановление пароля</h1>

          {fp.step === 1 && (
            <EmailStep form={fp.emailForm} isLoading={fp.isEmailLoading} onSubmit={fp.submitEmail} />
          )}
          {fp.step === 2 && (
            <CodeStep form={fp.codeForm} isLoading={fp.isCodeLoading} onSubmit={fp.submitCode} />
          )}
          {fp.step === 3 && (
            <NewPasswordStep
              form={fp.passwordForm}
              isLoading={fp.isPasswordLoading}
              onSubmit={fp.submitPassword}
            />
          )}

          {fp.step === 1 && (
            <div className={styles.footer}>
              <Link href="/login" className={styles.link}>
                Вернуться ко входу
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
