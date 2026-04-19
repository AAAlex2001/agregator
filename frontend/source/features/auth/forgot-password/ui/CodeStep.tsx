import { FormEvent } from "react";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import s from "./CodeStep.module.scss";

interface Props {
  code: string;
  isLoading: boolean;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function CodeStep({ code, isLoading, onChange, onSubmit }: Props) {
  return (
    <>
      <p className={s.stepText}>Шаг 2. Введите код, отправленный на почту</p>
      <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="forgot-password-code" />
        <Input id="code" name="forgot-password-code" variant="code" value={code}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)} placeholder="Код" required />
        <p className={s.helperText}>Если код отсутствует, проверьте папку «Спам»</p>
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading} disabled={!code.trim()}>
          Подтвердить код
        </Button>
      </form>
    </>
  );
}
