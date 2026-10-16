"use client";

import {
  ReferralConditions,
  ReferralStats,
  useReferralOverview,
} from "@/entities/referral";
import { Button } from "@/shared/ui/button";
import { ReferralInvite } from "../referral-invite";
import { ReferralSettingsSkeleton } from "../referral-settings-skeleton";
import styles from "./style.module.scss";

/** Загружает реферальную программу: приглашение, результаты и условия. */
export function ReferralProgram() {
  const { state, retry } = useReferralOverview();
  const { overview } = state;

  if (state.isLoading) {
    return <ReferralSettingsSkeleton />;
  }

  if (!overview) {
    return (
      <div className={styles.failure}>
        <p
          className={styles.error}
          role="alert"
        >
          {state.error}
        </p>
        <Button
          variant="outlineOrange"
          size="sm"
          onClick={retry}
        >
          Попробовать ещё раз
        </Button>
      </div>
    );
  }

  return (
    <section
      className={styles.panel}
      aria-label="Приглашения"
    >
      <ReferralInvite overview={overview} />
      <ReferralStats overview={overview} />
      <ReferralConditions overview={overview} />
      <p className={styles.footnote}>
        Плюсы — внутренние баллы для оплаты услуг Ресурс-Плюс. Обменять их на деньги
        или вывести нельзя.
      </p>
    </section>
  );
}
