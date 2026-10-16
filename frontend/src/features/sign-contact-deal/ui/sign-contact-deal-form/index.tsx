"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { LockIcon } from "@/shared/ui/icons";
import { PasswordInput } from "@/shared/ui/password-input";
import { useSignContactDeal } from "../../model/use-sign-contact-deal";
import styles from "./style.module.scss";

/** Сделка, договор которой подписывает текущая сторона. */
interface SignContactDealFormProps {
  dealId: number;
}

/** Подтверждает согласие с договором простой электронной подписью. */
export function SignContactDealForm({ dealId }: SignContactDealFormProps) {
  const form = useSignContactDeal(dealId);

  /** Отправляет подпись без перезагрузки страницы. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.sign();
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <Checkbox
        id="contact-contract-accept"
        checked={form.accepted}
        onChange={form.changeAccepted}
      >
        Принимаю условия договора и подписываю его простой электронной подписью
      </Checkbox>
      <div className={styles.controls}>
        <label className={styles.passwordField}>
          <span>Пароль от вашего аккаунта</span>
          <PasswordInput
            value={form.password}
            onChange={(event) => form.changePassword(event.target.value)}
            placeholder="Введите пароль, которым вы входите на платформу"
            autoComplete="current-password"
            required
          />
        </label>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className={styles.submit}
          isLoading={form.isSigning}
          disabled={!form.canSign}
        >
          <LockIcon /> Подписать договор
        </Button>
      </div>
    </form>
  );
}
