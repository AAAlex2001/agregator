"use client";

import cn from "classnames";
import {
  getPricingCardState,
  PricingCard,
  useSubscription,
} from "@/entities/pricing";
import { useSubscribeToPlan } from "@/features/subscribe-to-plan";
import { SubscriptionSettingsSkeleton } from "../subscription-settings-skeleton";
import { SubscriptionStatus } from "../subscription-status";
import styles from "./style.module.scss";

/** Собирает текущую подписку и выбор тарифов во вкладке настроек. */
export function SubscriptionSettings() {
  const { plans, subscription, error } = useSubscription();
  const { select, pendingPlanId } = useSubscribeToPlan();

  if (error) {
    return (
      <div className={styles.statusBlock}>
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      </div>
    );
  }

  if (plans === null) {
    return <SubscriptionSettingsSkeleton />;
  }

  if (plans.length === 0) {
    return <p className={styles.statusSubtitle}>Тарифы пока недоступны.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <SubscriptionStatus subscription={subscription} />
      <div className={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(styles.gridItem, {
              [styles.gridItemHighlighted]: plan.highlighted,
            })}
          >
            <PricingCard
              plan={plan}
              state={getPricingCardState(plan, subscription)}
              onSelect={select}
              isLoading={pendingPlanId === plan.id}
              disabled={pendingPlanId !== null && pendingPlanId !== plan.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
