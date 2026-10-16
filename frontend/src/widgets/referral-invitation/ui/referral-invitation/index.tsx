"use client";

import Link from "next/link";
import { useReferralInvitation } from "@/features/register-by-invitation";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { LogoIcon } from "@/shared/ui/icons";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { InvitationActions } from "../invitation-actions";
import styles from "./style.module.scss";

/** Проверенное приглашение и действия общей авторизации приложения. */
interface ReferralInvitationProps {
  referralCode: string | null;
  invalidInvitation: boolean;
  onOpenRegistration: () => void;
  onOpenLogin: () => void;
}

/** Собирает страницу приглашения и доступные действия регистрации исполнителя. */
export function ReferralInvitation({
  referralCode,
  invalidInvitation,
  onOpenRegistration,
  onOpenLogin,
}: ReferralInvitationProps) {
  const { isAuthenticated, isLoading, error, openRegistration } = useReferralInvitation({
    referralCode,
    onOpenRegistration,
  });

  return (
    <main className={styles.page}>
      <Link
        href="/"
        className={styles.brand}
        aria-label="На главную"
      >
        <LogoIcon title="Ресурс-Плюс" />
      </Link>
      <section className={styles.card}>
        <Breadcrumbs
          className={styles.breadcrumbs}
          items={[
            {
              label: "Главная",
              href: isAuthenticated ? "/landing" : "/",
            },
            { label: "Регистрация" },
          ]}
        />
        <p className={styles.eyebrow}>Сообщество исполнителей</p>
        <Title
          as="h1"
          text={
            referralCode
              ? "Коллега приглашает вас в Ресурс-Плюс"
              : "Регистрация исполнителя"
          }
          className={styles.title}
        />
        <Subtitle
          text="Укажите свои направления работы и находите заказы на площадке. Для завершения регистрации подтвердите почту."
          className={styles.description}
        />
        {invalidInvitation && (
          <p
            className={styles.message}
            role="alert"
          >
            Код приглашения некорректен. Попросите коллегу прислать ссылку ещё раз. Вы
            также можете зарегистрироваться без приглашения.
          </p>
        )}
        {error && (
          <p
            className={styles.message}
            role="alert"
          >
            {error}
          </p>
        )}
        <InvitationActions
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          error={error}
          onOpenRegistration={openRegistration}
          onOpenLogin={onOpenLogin}
        />
      </section>
    </main>
  );
}
