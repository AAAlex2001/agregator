"use client";

import { useState, type FormEvent } from "react";
import { Button, Checkbox, PasswordInput } from "@/source/shared/ui";
import { LockIcon } from "@/source/shared/ui/icons";
import s from "./ContactSignatureForm.module.scss";

interface ContactSignatureFormProps {
  busy: boolean;
  onSign: (password: string) => Promise<void>;
}

export function ContactSignatureForm({ busy, onSign }: ContactSignatureFormProps) {
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accepted || password.length === 0) return;
    await onSign(password);
    setPassword("");
    setAccepted(false);
  };

  return (
    <form className={s.form} onSubmit={submit}>
      <Checkbox id="contact-contract-accept" checked={accepted} onChange={setAccepted}>
        Принимаю условия договора и подписываю его простой электронной подписью
      </Checkbox>
      <div className={s.controls}>
        <label className={s.passwordField}>
          <span>Пароль от вашего аккаунта</span>
          <PasswordInput
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль, которым вы входите на платформу"
            autoComplete="current-password"
            required
          />
        </label>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className={s.submitButton}
          isLoading={busy}
          disabled={!accepted || password.length === 0}
        >
          <LockIcon /> Подписать договор
        </Button>
      </div>
    </form>
  );
}
