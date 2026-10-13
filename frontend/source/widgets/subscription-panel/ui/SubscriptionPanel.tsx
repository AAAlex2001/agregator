"use client";

import cn from "classnames";
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
  const { plans, subscription, error } = useSubscription();

  if (error) {
    return (
      <div className={s.statusBlock}>
        <p className={s.error} role="alert">{error}</p>
      </div>
    );
  }

  if (plans === null) {
    return <SubscriptionPanelSkeleton />;
  }

  if (plans.length === 0) {
    return <p className={s.statusSubtitle}>Тарифы пока недоступны.</p>;
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
              className={cn(s.gridItem, { [s.gridItemHighlighted]: plan.highlighted })}
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
        <div className={cn(s.gridItem, s.gridItemHighlighted)}>
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
