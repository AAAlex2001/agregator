"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { confirmResetCode, requestPasswordReset, resetPassword } from "@/source/entities/user";
import {
  forgotCodeSchema,
  forgotEmailSchema,
  forgotNewPasswordSchema,
  type ForgotCodeValues,
  type ForgotEmailValues,
  type ForgotNewPasswordValues,
} from "./schema";

export type ForgotPasswordStep = 1 | 2 | 3 | 4;

export function useForgotPassword() {
  const { showError } = useNotifications();
  const [step, setStep] = useState<ForgotPasswordStep>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const emailForm = useForm<ForgotEmailValues>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const codeForm = useForm<ForgotCodeValues>({
    resolver: zodResolver(forgotCodeSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const passwordForm = useForm<ForgotNewPasswordValues>({
    resolver: zodResolver(forgotNewPasswordSchema),
    defaultValues: { password: "", repeatPassword: "" },
    mode: "onBlur",
  });

  const showFirstError = (errors: Record<string, { message?: string } | undefined>) => {
    const first = Object.values(errors)[0];
    if (first && "message" in first && typeof first.message === "string") {
      showError(first.message);
    }
  };

  const submitEmail = emailForm.handleSubmit(
    async (values) => {
      try {
        await requestPasswordReset(values.email.trim());
        setEmail(values.email.trim());
        setStep(2);
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    showFirstError,
  );

  const submitCode = codeForm.handleSubmit(
    async (values) => {
      try {
        await confirmResetCode(email, values.code);
        setCode(values.code);
        setStep(3);
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    showFirstError,
  );

  const submitPassword = passwordForm.handleSubmit(
    async (values) => {
      try {
        await resetPassword(email, code, values.password);
        setStep(4);
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    showFirstError,
  );

  return {
    step,
    email,
    emailForm,
    codeForm,
    passwordForm,
    isEmailLoading: emailForm.formState.isSubmitting,
    isCodeLoading: codeForm.formState.isSubmitting,
    isPasswordLoading: passwordForm.formState.isSubmitting,
    submitEmail,
    submitCode,
    submitPassword,
  };
}
