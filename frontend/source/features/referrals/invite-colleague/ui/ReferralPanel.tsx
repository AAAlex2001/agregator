"use client";

import { useId } from "react";
import { formatPluses } from "@/source/entities/referral";
import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { TextInput } from "@/source/shared/ui/Inputs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useReferralOverview } from "../model/useReferralOverview";
import { useCopyReferralLink } from "../model/useCopyReferralLink";
import { ReferralPool } from "./ReferralPool";
import { ReferralConditions } from "./ReferralConditions";
import s from "./ReferralPanel.module.scss";

/** Показывает персональную ссылку, бонусы и условия приглашения коллег. */
export function ReferralPanel() {
  const { overview, error, isLoading, reload } = useReferralOverview();
  const { copied, isCopying, error: copyError, inputRef, copyLink } = useCopyReferralLink(overview?.referral_url);
  const panelId = useId();

  return (
    <section className={s.panel} aria-labelledby={`${panelId}-title`} aria-busy={isLoading}>
      <div className={s.header}>
        <div className={s.heading}>
          <Title id={`${panelId}-title`} text="Приглашайте коллег" className={s.title} />
          {overview && !isLoading && !error && (
            <Subtitle
              text={`Получайте ${formatPluses(overview.reward_points)}* за каждого нового исполнителя.`}
              className={s.description}
            />
          )}
        </div>
        {overview && !isLoading && !error && (
          <ReferralPool
            totalPoints={overview.pool_total_points}
            remainingPoints={overview.pool_remaining_points}
          />
        )}
      </div>

      {isLoading ? (
        <div className={s.loading} role="status" aria-label="Загружаем приглашения">
          <Skeleton className={s.textSkeleton} />
          <Skeleton className={s.balanceSkeleton} />
          <Skeleton className={s.linkSkeleton} />
        </div>
      ) : error ? (
        <div className={s.failure}>
          <p className={s.error} role="alert">{error}</p>
          <Button variant="outlineOrange" size="sm" onClick={reload}>Попробовать ещё раз</Button>
        </div>
      ) : overview ? (
        <>
          <dl className={s.stats}>
            <div>
              <dt>Ваши плюсы</dt>
              <dd>{formatPluses(overview.balance_points)}</dd>
            </div>
            <div>
              <dt>Приглашено</dt>
              <dd>{overview.invited_count}</dd>
            </div>
            <div>
              <dt>Бонус начислен</dt>
              <dd>{overview.rewarded_count}</dd>
            </div>
          </dl>

          {!overview.accepting_referrals && (
            <p className={s.notice} role="status">
              Начисление новых плюсов приостановлено. Накопленные плюсы сохранены.
            </p>
          )}

          <label htmlFor={`${panelId}-link`} className={s.label}>Ваша ссылка для приглашения</label>
          <div className={s.linkRow}>
            <TextInput
              ref={inputRef}
              id={`${panelId}-link`}
              className={s.linkField}
              inputClassName={s.linkInput}
              value={overview.referral_url}
              readOnly
              onClick={(event) => event.currentTarget.select()}
            />
            <Button variant="chat" className={s.copyButton} onClick={copyLink} disabled={isCopying}>
              {copied ? "Скопировано" : "Скопировать"}
            </Button>
          </div>
          <span className={s.srOnly} role="status">{copied ? "Ссылка скопирована" : ""}</span>
          {copyError && <p className={s.error} role="alert">{copyError}</p>}

          <p className={s.footnote}>
            * Плюсы — внутренние баллы Ресурс-Плюс для оплаты услуг на сайте. Это не деньги:
            обменять на рубли или вывести их нельзя.
          </p>

          <ReferralConditions overview={overview} />
        </>
      ) : null}
    </section>
  );
}
