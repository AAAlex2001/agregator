"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { OtpCodeInput } from "@/shared/ui/otp-code-input";
import type { ConfirmEmailOptions } from "../../model/types";
import { useConfirmEmailForm } from "../../model/use-confirm-email-form";
import styles from "./style.module.scss";

/** Показывает ввод кода подтверждения и повторную отправку письма. */
export function ConfirmEmailForm(props: ConfirmEmailOptions) {
  const form = useConfirmEmailForm(props);
  const { state } = form;

  /** Запускает подтверждение без браузерной перезагрузки страницы. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.confirm();
  }

  return (
    <form
      onSubmit={submit}
      className={styles.form}
    >
      <h2 className={styles.title}>Подтвердите почту</h2>
      <p className={styles.hint}>
        Письмо с кодом отправлено на <span className={styles.email}>{props.email}</span>
      </p>

      <OtpCodeInput
        value={state.code}
        onChange={form.changeCode}
        disabled={form.isBusy || form.isEmailConfirmed}
        autoFocus
      />
      <p className={styles.spam}>Если письма нет, проверьте папку «Спам»</p>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={state.isSubmitting}
        disabled={form.isResending}
      >
        Подтвердить
      </Button>

      <button
        type="button"
        className={styles.resend}
        disabled={form.isBusy || form.isEmailConfirmed}
        onClick={() => void form.resend()}
      >
        {form.isResending ? (
          <Loader
            size="sm"
            label=""
          />
        ) : (
          "Отправить код снова"
        )}
      </button>
    </form>
  );
}
