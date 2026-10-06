"use client";

import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { LogoIcon } from "@/source/shared/ui/icons";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useReferralInvitation } from "../model/useReferralInvitation";
import type { ReferralInvitationProps } from "../model/types";
import s from "./ReferralInvitation.module.scss";

/** Показывает приглашение и доступные действия регистрации. */
export function ReferralInvitation({ referralCode, invalidInvitation }: ReferralInvitationProps) {
  const { isAuthenticated, isLoading, error, openRegistration, openLogin } = useReferralInvitation(referralCode);

  return (
    <main className={s.page}>
      <Link href="/" className={s.brand} aria-label="На главную">
        <LogoIcon title="Ресурс-Плюс" />
      </Link>
      <section className={s.card}>
        <p className={s.eyebrow}>Сообщество исполнителей</p>
        <Title
          as="h1"
          text={referralCode ? "Коллега приглашает вас в Ресурс-Плюс" : "Регистрация исполнителя"}
          className={s.title}
        />
        <Subtitle
          text="Укажите свои направления работы и находите заказы на площадке. Для завершения регистрации подтвердите почту."
          className={s.description}
        />
        {invalidInvitation && (
          <p className={s.message} role="alert">
            Код приглашения некорректен. Попросите коллегу прислать ссылку ещё раз.
            Вы также можете зарегистрироваться без приглашения.
          </p>
        )}
        {error && <p className={s.message} role="alert">{error}</p>}
        {isAuthenticated ? (
          <>
            <p className={`${s.message} ${s.signedIn}`}>
              Вы уже вошли в аккаунт. Приглашения действуют для новых исполнителей.
            </p>
            <Button href="/settings" variant="chat">Перейти в кабинет</Button>
          </>
        ) : (
          <div className={s.actions}>
            <Button variant="chat" onClick={openRegistration} disabled={isLoading || Boolean(error)}>
              Зарегистрироваться
            </Button>
            <button type="button" className={s.login} onClick={openLogin}>
              Уже есть аккаунт? Войти
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
