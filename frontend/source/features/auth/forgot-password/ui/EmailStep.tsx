import type { FormEvent } from "react";
import { EmailInput } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import s from "./EmailStep.module.scss";

interface Props {
  email: string;
  onEmailChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
}

export function EmailStep({ email, onEmailChange, isLoading, onSubmit }: Props) {
  return (
    <>
      <p className={s.stepText}>Шаг 1. Введите электронную почту</p>
      <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="forgot-password-email" />
        <EmailInput
          id="email"
          value={email}
          required
          autoComplete="off"
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Электронная почта"
        />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Подтвердить
        </Button>
      </form>
    </>
  );
}
