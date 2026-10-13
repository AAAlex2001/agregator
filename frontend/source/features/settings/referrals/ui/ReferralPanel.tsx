"use client";

import Button from "@/source/shared/ui/Button";
import { useReferralOverview } from "../model/useReferralOverview";
import { ReferralConditions } from "./ReferralConditions";
import { ReferralInvite } from "./ReferralInvite";
import { ReferralPanelSkeleton } from "./ReferralPanelSkeleton";
import { ReferralStats } from "./ReferralStats";
import s from "./ReferralPanel.module.scss";

/** Вкладка «Приглашения»: персональная ссылка, итоги приглашений и условия программы. */
export function ReferralPanel() {
  const { state, retry } = useReferralOverview();
  const { overview } = state;

  if (state.isLoading) return <ReferralPanelSkeleton />;

  if (!overview) {
    return (
      <div className={s.failure}>
        <p className={s.error} role="alert">
          {state.error}
        </p>
        <Button variant="outlineOrange" size="sm" onClick={retry}>
          Попробовать ещё раз
        </Button>
      </div>
    );
  }

  return (
    <section className={s.panel} aria-label="Приглашения">
      <ReferralInvite overview={overview} />
      <ReferralStats overview={overview} />
      <ReferralConditions overview={overview} />
      <p className={s.footnote}>
        Плюсы — внутренние баллы для оплаты услуг Ресурс-Плюс. Обменять их на деньги или вывести нельзя.
      </p>
    </section>
  );
}
