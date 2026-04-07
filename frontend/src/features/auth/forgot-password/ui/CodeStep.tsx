import { FormEvent } from "react";
import { Input } from "@/shared/ui";

interface CodeStepProps {
  code: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  styles: Record<string, string>;
}

export function CodeStep({ code, onChange, onSubmit, styles }: CodeStepProps) {
  return (
    <>
      <p className={styles.stepText}>Шаг 2. Введите код, отправленный на почту</p>
      <form onSubmit={onSubmit} className={styles.form}>
        <Input id="code" variant="code" value={code}
          onChange={(e) => onChange(e.target.value)} placeholder="Код" required />
        <p className={styles.helperText}>Если код отсутствует, проверьте папку «Спам»</p>
        <button type="submit" className={styles.submitButton} disabled={!code.trim()}>
          Подтвердить код
        </button>
      </form>
    </>
  );
}
