"use client";

import Image from "next/image";
import { useId } from "react";
import { formatPluses, type ReferralOverview } from "@/source/entities/referral";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { useCopyReferralLink } from "../model/useCopyReferralLink";
import s from "./ReferralInvite.module.scss";

interface ReferralInviteProps {
  overview: ReferralOverview;
}

/** Карточка приглашения: бонус за коллегу, персональная ссылка с кнопкой «Скопировать» и иллюстрация. */
export function ReferralInvite({ overview }: ReferralInviteProps) {
  const id = useId();
  const { copied, error, inputRef, copyLink } = useCopyReferralLink(overview.referral_url);

  return (
    <div className={s.card}>
      <div className={s.copy}>
        <div className={s.hero}>
          <span className={s.reward}>+{formatPluses(overview.reward_points)}</span>
          <Title id={`${id}-title`} text="Приглашайте коллег, получайте плюсы" as="h2" className={s.title} />
          <Subtitle
            text="Поделитесь ссылкой с теми, кому доверяете. За каждого нового исполнителя, выполнившего условия программы, начислим бонус для оплаты услуг платформы."
            className={s.description}
          />
        </div>

        {!overview.accepting_referrals && (
          <p className={s.notice} role="status">
            Начисление новых плюсов приостановлено. Накопленные плюсы сохранены.
          </p>
        )}

        <div className={s.invite}>
          <label htmlFor={`${id}-link`} className={s.label}>
            Ваша персональная ссылка
          </label>
          <div className={s.linkRow}>
            <TextInput
              ref={inputRef}
              id={`${id}-link`}
              className={s.linkField}
              inputClassName={s.linkInput}
              value={overview.referral_url}
              readOnly
              onClick={(event) => event.currentTarget.select()}
            />
            <Button variant="chat" className={s.copyButton} onClick={copyLink}>
              {copied ? "Скопировано" : "Скопировать"}
            </Button>
          </div>
          <span className={s.srOnly} role="status">
            {copied ? "Ссылка скопирована" : ""}
          </span>
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className={s.artwork}>
        <Image
          src="/referral-colleagues.webp"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1440px) 600px, (min-width: 768px) 50vw, 100vw"
          className={s.illustration}
        />
      </div>
    </div>
  );
}
