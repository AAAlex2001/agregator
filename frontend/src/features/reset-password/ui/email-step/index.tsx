import type { FormEvent } from "react";
import { AutofillGuard } from "@/shared/ui/autofill-guard";
import { Button } from "@/shared/ui/button";
import { EmailInput } from "@/shared/ui/email-input";
import styles from "./style.module.scss";

interface EmailStepProps {
  email: string;
  isSubmitting: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: () => Promise<void>;
}

/** Запрашивает код восстановления для указанной почты. */
export function EmailStep({
  email,
  isSubmitting,
  onEmailChange,
  onSubmit,
}: EmailStepProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <form
      onSubmit={submit}
      className={styles.form}
      autoComplete="off"
      data-lpignore="true"
      data-1p-ignore="true"
    >
      <AutofillGuard idPrefix="forgot-password-email" />
      <p className={styles.step}>Шаг 1. Введите электронную почту</p>
      <EmailInput
        id="forgot-password-email"
        value={email}
        required
        autoComplete="off"
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder="Электронная почта"
      />
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
      >
        Получить код
      </Button>
    </form>
  );
}
