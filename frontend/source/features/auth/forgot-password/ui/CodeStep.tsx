import type { FormEvent } from "react";
import { OtpCodeInput } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import s from "./CodeStep.module.scss";

interface CodeStepProps {
  code: string;
  isSubmitting: boolean;
  onCodeChange: (code: string) => void;
  onSubmit: (event: FormEvent) => void;
}

/** Шаг 2: код из письма. */
export function CodeStep({ code, isSubmitting, onCodeChange, onSubmit }: CodeStepProps) {
  return (
    <form onSubmit={onSubmit} className={s.form}>
      <p className={s.step}>Шаг 2. Введите код, отправленный на почту</p>
      <OtpCodeInput value={code} onChange={onCodeChange} autoFocus />
      <p className={s.spam}>Если письма нет, проверьте папку «Спам»</p>
      <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
        Подтвердить код
      </Button>
    </form>
  );
}
