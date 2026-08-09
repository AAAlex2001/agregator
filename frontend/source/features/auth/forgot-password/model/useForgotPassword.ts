"use client";

import { useState, type FormEvent } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { confirmResetCode, requestPasswordReset, resetPassword } from "@/source/entities/user";

export type ForgotPasswordStep = 1 | 2 | 3 | 4;

export function useForgotPassword() {
  const { showError } = useNotifications();
  const [step, setStep] = useState<ForgotPasswordStep>(1);
  const [waiting, setWaiting] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    setWaiting(true);
    try {
      await requestPasswordReset(email.trim());
      setStep(2);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setWaiting(false);
    }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      showError("Введите 6-значный код");
      return;
    }
    setWaiting(true);
    try {
      await confirmResetCode(email.trim(), code);
      setStep(3);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setWaiting(false);
    }
  };

  const submitPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      showError("Пароли не совпадают");
      return;
    }
    setWaiting(true);
    try {
      await resetPassword(email.trim(), code, password);
      setStep(4);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setWaiting(false);
    }
  };

  return {
    step,
    waiting,
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    submitEmail,
    submitCode,
    submitPassword,
  };
}
