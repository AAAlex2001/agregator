"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/app/components";
import { LogoIcon } from "@/app/icons";
import styles from "./forgot-password.module.scss";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Восстановление пароля:", { email });
    setStep(2);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Подтверждение кода:", { email, code });
    setStep(3);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Сохранение нового пароля:", { email, code, password, repeatPassword });
    setStep(4);
  };

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const isEmailButtonDisabled = !email.trim();
  const isCodeButtonDisabled = !code.trim();
  const isPasswordButtonDisabled = !password.trim() || !repeatPassword.trim();

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        {step === 4 ? (
          <div className={styles.successContainer}>
            <motion.div
              className={styles.successCircle}
              initial={{ scale: 25, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18
              }}
            />

            <motion.svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              className={styles.checkmark}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="#FF8A00"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            
            <motion.h2
              className={styles.successTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Успешно
            </motion.h2>
            <motion.p
              className={styles.successText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              Вы обновили пароль.<br />
              Через мгновение продолжите<br />
              вход с новым паролем
            </motion.p>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <Link href="/" className={styles.logo}>
                <LogoIcon title="Ресурс-Плюс" />
              </Link>
            </div>

            <h1 className={styles.title}>Восстановление пароля</h1>

            {step === 1 ? (
            <>
              <p className={styles.stepText}>Шаг 1. Введите электронную почту</p>

              <form onSubmit={handleEmailSubmit} className={styles.form}>
                <Input
                  id="email"
                  variant="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Электронная почта"
                  required
                />

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isEmailButtonDisabled}
                >
                  Подтвердить
                </button>
              </form>
            </>
          ) : step === 2 ? (
            <>
              <p className={styles.stepText}>Шаг 2. Введите код, отправленный на почту</p>

              <form onSubmit={handleCodeSubmit} className={styles.form}>
                <Input
                  id="code"
                  variant="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Код"
                  required
                />

                <p className={styles.helperText}>Если код отсутствует, проверьте папку «Спам»</p>

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isCodeButtonDisabled}
                >
                  Подтвердить код
                </button>
              </form>
            </>
          ) : (
            <>
              <p className={styles.stepText}>Шаг 3. Создание нового пароля</p>

              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <Input
                  id="password"
                  variant="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                />

                <Input
                  id="repeatPassword"
                  variant="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isPasswordButtonDisabled}
                >
                  Сохранить изменения
                </button>
              </form>
            </>
          )}

            {step === 1 && (
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

