"use client";

import { useId } from "react";
import { formatBonusAmount } from "@/source/entities/referral";
import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { TextInput } from "@/source/shared/ui/Inputs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useReferralOverview } from "../model/useReferralOverview";
import { useCopyReferralLink } from "../model/useCopyReferralLink";
import s from "./ReferralPanel.module.scss";

/** Показывает персональную ссылку, бонусы и условия приглашения коллег. */
export function ReferralPanel() {
  const { overview, error, isLoading, reload } = useReferralOverview();
  const { copied, isCopying, error: copyError, inputRef, copyLink } = useCopyReferralLink(overview?.referral_url);
  const panelId = useId();

  return (
    <section className={s.panel} aria-labelledby={`${panelId}-title`} aria-busy={isLoading}>
      <Title id={`${panelId}-title`} text="Приглашайте коллег" className={s.title} />

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
          <Subtitle
            text={`Получайте ${formatBonusAmount(overview.reward_kopecks)}* за каждого нового исполнителя.`}
            className={s.description}
          />

          <dl className={s.stats}>
            <div>
              <dt>Бонусный баланс</dt>
              <dd>{formatBonusAmount(overview.balance_kopecks)}</dd>
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
              Начисление новых бонусов приостановлено. Доступный баланс сохранён.
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

          <p className={s.footnote}>* Бонусы зачисляются на внутренний счёт сайта. Вывести их нельзя.</p>

          <details className={s.details}>
            <summary>Условия и результаты приглашений</summary>
            <div className={s.conditions}>
              <p>
                Коллега должен зарегистрироваться по вашей ссылке как исполнитель, подтвердить почту,
                указать имя и заполнить хотя бы одно направление. Бонус начисляется автоматически.
              </p>
              <p>Приглашение уже зарегистрированных пользователей и самого себя не учитывается.</p>
              <p>
                Общий фонд — {formatBonusAmount(overview.pool_total_kopecks)}.
                Осталось — {formatBonusAmount(overview.pool_remaining_kopecks)}.
                Бонус начисляется, пока программа действует и в фонде хватает на полное вознаграждение.
              </p>
              <dl className={s.results}>
                <div><dt>Ожидают выполнения условий</dt><dd>{overview.pending_count}</dd></div>
                <div><dt>Без бонуса: фонд закончился</dt><dd>{overview.pool_exhausted_count}</dd></div>
                <div><dt>Не соответствуют условиям</dt><dd>{overview.rejected_count}</dd></div>
              </dl>
            </div>
          </details>
        </>
      ) : null}
    </section>
  );
}
