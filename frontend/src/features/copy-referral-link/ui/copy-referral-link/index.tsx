"use client";

import type { MouseEvent } from "react";
import { Button } from "@/shared/ui/button";
import { TextInput } from "@/shared/ui/text-input";
import { useCopyReferralLink } from "../../model/use-copy-referral-link";
import styles from "./style.module.scss";

/** Персональная ссылка приглашения и идентификатор поля для доступной подписи. */
interface CopyReferralLinkProps {
  link: string;
  inputId: string;
}

/** Показывает ссылку и копирует её в буфер по нажатию кнопки. */
export function CopyReferralLink({ link, inputId }: CopyReferralLinkProps) {
  const { copied, error, inputRef, copyLink } = useCopyReferralLink(link);

  /** Выделяет всю ссылку при нажатии на поле. */
  function selectLink(event: MouseEvent<HTMLInputElement>) {
    event.currentTarget.select();
  }

  return (
    <div className={styles.invite}>
      <label
        htmlFor={inputId}
        className={styles.label}
      >
        Ваша персональная ссылка
      </label>
      <div className={styles.linkRow}>
        <TextInput
          ref={inputRef}
          id={inputId}
          className={styles.linkField}
          inputClassName={styles.linkInput}
          value={link}
          readOnly
          onClick={selectLink}
        />
        <Button
          variant="chat"
          className={styles.copyButton}
          onClick={copyLink}
        >
          {copied ? "Скопировано" : "Скопировать"}
        </Button>
      </div>
      <span
        className={styles.srOnly}
        role="status"
      >
        {copied ? "Ссылка скопирована" : ""}
      </span>
      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
