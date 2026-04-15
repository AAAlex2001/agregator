import { FormEvent } from "react";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
import s from "./EmailStep.module.scss";

interface Props {
  email: string;
  isLoading: boolean;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function EmailStep({ email, isLoading, onChange, onSubmit }: Props) {
  return (
    <>
      <p className={s.stepText}>Шаг 1. Введите электронную почту</p>
      <form onSubmit={onSubmit} className={s.form}>
        <Input id="email" variant="email" value={email}
          onChange={(e) => onChange(e.target.value)} placeholder="Электронная почта" required />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading} disabled={!email.trim()}>
          Подтвердить
        </Button>
      </form>
    </>
  );
}
