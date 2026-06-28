"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  PricingCard,
  PricingCardSkeleton,
  derivePricingCardState,
  type PricingPlan,
  type UserSubscription,
} from "@/source/entities/pricing";
import { fetchMySubscription, fetchPricingPlans, useSubscribeToPlan } from "@/source/features/pricing/subscribe";
import s from "./SubscriptionPanel.module.scss";

export function SubscriptionPanel() {
  const { select, pendingPlanId } = useSubscribeToPlan();
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const [plansResult, subResult] = await Promise.all([fetchPricingPlans(), fetchMySubscription()]);
      if (disposed) return;
      setPlans(plansResult);
      setSubscription(subResult);
    })();
    return () => { disposed = true; };
  }, []);

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
            <span className={s.statusTitle}>Сейчас отклики на заказы бесплатны</span>
            <span className={s.statusSubtitle}>
              Откликайтесь на проекты по экспертизе промышленной безопасности и проектированию без подписки. Оформите тариф заранее — поддержите развитие сервиса и зафиксируйте цену до перехода на платный доступ.
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
