import { useState } from "react";
import type { ForgotPasswordState, ForgotPasswordStep } from "./types";

export function useForgotPasswordState() {
  const [step, setStep] = useState<ForgotPasswordStep>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    step,
    email,
    code,
    password,
    repeatPassword,
    isLoading,
    error,
    setStep,
    setEmail,
    setCode,
    setPassword,
    setRepeatPassword,
    setIsLoading,
    setError,
  };
}
