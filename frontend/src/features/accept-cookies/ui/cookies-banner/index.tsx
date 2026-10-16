"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { CookieIcon } from "@/shared/ui/icons";
import { useCookieConsent } from "../../model/use-cookie-consent";
import styles from "./style.module.scss";

/** Показывает правила использования cookie до принятия пользователем. */
export function CookiesBanner() {
  const { isVisible, acceptCookies } = useCookieConsent();

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.wrap}
      role="dialog"
      aria-label="Использование cookies"
    >
      <div className={styles.card}>
        <span
          className={styles.icon}
          aria-hidden="true"
        >
          <CookieIcon />
        </span>
        <p className={styles.text}>
          Мы используем cookie-файлы для улучшения работы сайта. Продолжая использование,
          вы соглашаетесь с{" "}
          <Link
            href="/privacy-policy"
            className={styles.link}
          >
            политикой конфиденциальности
          </Link>{" "}
          и{" "}
          <Link
            href="/user-agreement"
            className={styles.link}
          >
            пользовательским соглашением
          </Link>
          .
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={acceptCookies}
          className={styles.button}
        >
          Принять
        </Button>
      </div>
    </div>
  );
}
