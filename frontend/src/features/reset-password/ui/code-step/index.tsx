import type { FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { OtpCodeInput } from "@/shared/ui/otp-code-input";
import styles from "./style.module.scss";

interface CodeStepProps {
  code: string;
  isSubmitting: boolean;
  onCodeChange: (code: string) => void;
  onSubmit: () => Promise<void>;
}

/** Проверяет шестизначный код из письма восстановления. */
export function CodeStep({
  code,
  isSubmitting,
  onCodeChange,
  onSubmit,
}: CodeStepProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  return (
    <form
      onSubmit={submit}
      className={styles.form}
    >
      <p className={styles.step}>
        Шаг 2. Введите код, отправленный на почту
      </p>
      <OtpCodeInput
        value={code}
        onChange={onCodeChange}
        autoFocus
      />
      <p className={styles.spam}>
        Если письма нет, проверьте папку «Спам»
      </p>
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
      >
        Подтвердить код
      </Button>
    </form>
  );
}
