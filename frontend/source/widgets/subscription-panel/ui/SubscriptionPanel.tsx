"use client";

import Skeleton from "@/source/shared/ui/Skeleton";
import {
  PricingCard,
  PricingCardSkeleton,
  derivePricingCardState,
} from "@/source/entities/pricing";
import { useSubscribeToPlan, useSubscription } from "@/source/features/pricing/subscribe";
import s from "./SubscriptionPanel.module.scss";

export function SubscriptionPanel() {
  const { select, pendingPlanId } = useSubscribeToPlan();
  const { plans, subscription } = useSubscription();

  if (plans === null) {
    return <SubscriptionPanelSkeleton />;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.statusBlock}>
        {subscription ? (
          <>
            <span className={s.statusTitle}>{subscription.plan_name}</span>
            <span className={s.statusSubtitle}>{subscription.active_label}</span>
          </>
        ) : (
          <>
            <span className={s.statusTitle}>Выберите тариф для работы на платформе</span>
            <span className={s.statusSubtitle}>
              Подписка открывает отклики на заказы по экспертизе промышленной безопасности и проектированию, прямое общение с заказчиками и доступ к профессиональным инструментам «Оценка крепи» и «Оценка опасности».
            </span>
          </>
        )}
      </div>

      <div className={s.grid}>
        {plans.map((plan) => {
          const cardState = derivePricingCardState(plan, subscription);
          return (
            <div
              key={plan.id}
              className={`${s.gridItem} ${plan.highlighted ? s.gridItemHighlighted : ""}`}
            >
              <PricingCard
                plan={plan}
                state={cardState}
                onSelect={select}
                isLoading={pendingPlanId === plan.id}
                disabled={pendingPlanId !== null && pendingPlanId !== plan.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubscriptionPanelSkeleton() {
  return (
    <div className={s.wrapper} aria-hidden="true">
      <div className={s.statusBlock}>
        <Skeleton className={s.statusTitleSkeleton} rounded="md" />
        <Skeleton className={s.statusSubtitleSkeleton} rounded="md" />
      </div>
      <div className={s.grid}>
        <div className={`${s.gridItem} ${s.gridItemHighlighted}`}>
          <PricingCardSkeleton />
        </div>
        <div className={s.gridItem}>
          <PricingCardSkeleton />
        </div>
        <div className={s.gridItem}>
          <PricingCardSkeleton />
        </div>
      </div>
    </div>
  );
}
