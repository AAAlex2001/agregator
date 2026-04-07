import { FormEvent } from "react";
import { Input } from "@/shared/ui";

interface EmailStepProps {
  email: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  styles: Record<string, string>;
}

export function EmailStep({ email, onChange, onSubmit, styles }: EmailStepProps) {
  return (
    <>
      <p className={styles.stepText}>Шаг 1. Введите электронную почту</p>
      <form onSubmit={onSubmit} className={styles.form}>
        <Input id="email" variant="email" value={email}
          onChange={(e) => onChange(e.target.value)} placeholder="Электронная почта" required />
        <button type="submit" className={styles.submitButton} disabled={!email.trim()}>
          Подтвердить
        </button>
      </form>
    </>
  );
}
