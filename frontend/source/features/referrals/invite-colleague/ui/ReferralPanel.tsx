"use client";

import { useId } from "react";
import Image from "next/image";
import { formatPluses } from "@/source/entities/referral";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useReferralOverview } from "../model/useReferralOverview";
import { useCopyReferralLink } from "../model/useCopyReferralLink";
import { ReferralPanelSkeleton } from "./ReferralPanelSkeleton";
import { ReferralConditions } from "./ReferralConditions";
import s from "./ReferralPanel.module.scss";

/** Показывает персональную ссылку, бонусы и условия приглашения коллег. */
export function ReferralPanel() {
  const { overview, error, isLoading, reload } = useReferralOverview();
  const { copied, isCopying, error: copyError, inputRef, copyLink } = useCopyReferralLink(overview?.referral_url);
  const panelId = useId();

  if (isLoading) return <ReferralPanelSkeleton />;

  return (
    <section className={s.panel} aria-labelledby={`${panelId}-title`}>
      <div className={s.invitationCard}>
        <div className={s.copy}>
          <div className={s.hero}>
            {overview && !error && (
              <span className={s.reward}>+{formatPluses(overview.reward_points)}</span>
            )}
            <Title id={`${panelId}-title`} text="Приглашайте коллег, получайте плюсы" as="h2" className={s.title} />
            <Subtitle
              text="Поделитесь ссылкой с теми, кому доверяете. За каждого нового исполнителя, выполнившего условия программы, начислим бонус для оплаты услуг платформы."
              className={s.description}
            />
          </div>

          {error ? (
            <div className={s.failure}>
              <p className={s.error} role="alert">{error}</p>
              <Button variant="outlineOrange" size="sm" onClick={reload}>Попробовать ещё раз</Button>
            </div>
          ) : overview ? (
            <>
              {!overview.accepting_referrals && (
                <p className={s.notice} role="status">
                  Начисление новых плюсов приостановлено. Накопленные плюсы сохранены.
                </p>
              )}

              <div className={s.invite}>
                <label htmlFor={`${panelId}-link`} className={s.label}>Ваша персональная ссылка</label>
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
              </div>
            </>
          ) : null}
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

      {overview && !error && (
        <>
          <section className={s.resultsSection} aria-label="Результаты приглашений">
            <h3 className={s.resultsTitle}>Ваши приглашения</h3>
            <dl className={s.stats}>
              <div>
                <dt>Ваши плюсы</dt>
                <dd>{formatPluses(overview.balance_points)}<Image src="/referral-balance.webp" alt="" width={120} height={120} className={s.statImage} /></dd>
              </div>
              <div>
                <dt>Приглашено</dt>
                <dd>{overview.invited_count}<Image src="/referral-invited.webp" alt="" width={120} height={120} className={s.statImage} /></dd>
              </div>
              <div>
                <dt>Бонус начислен</dt>
                <dd>{overview.rewarded_count}<Image src="/referral-rewarded.webp" alt="" width={120} height={120} className={s.statImage} /></dd>
              </div>
            </dl>
          </section>
          <ReferralConditions overview={overview} />
          <p className={s.footnote}>
            Плюсы — внутренние баллы для оплаты услуг Ресурс-Плюс.
            Обменять их на деньги или вывести нельзя.
          </p>
        </>
      )}
    </section>
  );
}
