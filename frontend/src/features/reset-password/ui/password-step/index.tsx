import type { FormEvent } from "react";
import {
  PASSWORD_MIN_LENGTH,
  PasswordRequirements,
} from "@/entities/user";
import { AutofillGuard } from "@/shared/ui/autofill-guard";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/password-input";
import styles from "./style.module.scss";

interface PasswordStepProps {
  password: string;
  repeatPassword: string;
  isSubmitting: boolean;
  onPasswordChange: (password: string) => void;
  onRepeatPasswordChange: (password: string) => void;
  onSubmit: () => Promise<void>;
}

/** Принимает новый пароль и его повтор, сохраняя прежние требования. */
export function PasswordStep({
  password,
  repeatPassword,
  isSubmitting,
  onPasswordChange,
  onRepeatPasswordChange,
  onSubmit,
}: PasswordStepProps) {
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
      <AutofillGuard idPrefix="forgot-password-new-password" />
      <p className={styles.step}>Шаг 3. Придумайте новый пароль</p>
      <PasswordInput
        id="forgot-password-new"
        value={password}
        required
        minLength={PASSWORD_MIN_LENGTH}
        autoComplete="new-password"
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Пароль"
      />
      <PasswordInput
        id="forgot-password-repeat"
        value={repeatPassword}
        required
        autoComplete="new-password"
        onChange={(event) => onRepeatPasswordChange(event.target.value)}
        placeholder="Повторите пароль"
      />
      <PasswordRequirements password={password} />
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
      >
        Сохранить пароль
      </Button>
    </form>
  );
}
