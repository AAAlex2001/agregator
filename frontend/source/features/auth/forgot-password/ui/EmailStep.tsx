import type { FormEvent } from "react";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Button from "@/source/shared/ui/Button";
import { EmailInput } from "@/source/shared/ui/Inputs";
import s from "./EmailStep.module.scss";

interface EmailStepProps {
  email: string;
  isSubmitting: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (event: FormEvent) => void;
}

/** Шаг 1: почта, на которую придёт код восстановления. */
export function EmailStep({ email, isSubmitting, onEmailChange, onSubmit }: EmailStepProps) {
  return (
    <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
      <AutofillGuard idPrefix="forgot-password-email" />
      <p className={s.step}>Шаг 1. Введите электронную почту</p>
      <EmailInput
        id="forgot-password-email"
        value={email}
        required
        autoComplete="off"
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder="Электронная почта"
      />
      <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
        Получить код
      </Button>
    </form>
  );
}
