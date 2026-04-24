"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/source/shared/ui/Skeleton";
import {
  fetchMySubscription,
  fetchPricingPlans,
  PricingCard,
  subscribeToPlan,
  type PricingPlan,
  type UserSubscription,
} from "@/source/entities/pricing";
import s from "./SubscriptionPanel.module.scss";

const KIND_LABELS: Record<string, string> = {
  SINGLE: "Разовый отклик",
  MONTHLY: "Месячная подписка",
  YEARLY: "Годовая подписка",
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function describeSubscription(sub: UserSubscription): string {
  if (sub.payment_pending) {
    return "Платёж в обработке. После подтверждения тариф активируется.";
  }
  if (sub.kind === "SINGLE") {
    const left = sub.responses_remaining ?? 0;
    return left > 0 ? `Осталось откликов: ${left}` : "Разовый отклик использован";
  }
  if (sub.expires_at) {
    return `Действует до ${formatDate(sub.expires_at)}`;
  }
  return "Активна";
}

export function SubscriptionPanel() {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const [plansResult, subResult] = await Promise.all([fetchPricingPlans(), fetchMySubscription()]);
      if (disposed) return;
      setPlans(plansResult);
      setSubscription(subResult);
    })();
    return () => {
      disposed = true;
    };
  }, []);

  const handleSelect = async (plan: PricingPlan) => {
    setError(null);
    setPendingPlanId(plan.id);
    try {
      const returnUrl = `${window.location.origin}/settings?section=subscription`;
      const result = await subscribeToPlan(plan.id, returnUrl);
      window.location.href = result.confirmation_url;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка оплаты";
      if (message.toLowerCase().includes("unauthor") || message.includes("401")) {
        router.push("/login");
        return;
      }
      setError(message);
    } finally {
      setPendingPlanId(null);
    }
  };

  if (plans === null) {
    return <SubscriptionPanelSkeleton />;
  }

  return (
    <div className={s.wrapper}>
      {subscription ? (
        <div className={s.statusBlock}>
          <span className={s.statusTitle}>
            {subscription.plan_name || KIND_LABELS[subscription.kind] || "—"}
          </span>
          <span className={s.statusSubtitle}>{describeSubscription(subscription)}</span>
        </div>
      ) : (
        <div className={s.statusBlock}>
          <span className={s.statusTitle}>У вас нет активной подписки</span>
          <span className={s.statusSubtitle}>Выберите тариф, чтобы откликаться на заказы.</span>
        </div>
      )}

      <div className={s.grid}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${s.gridItem} ${plan.highlighted ? s.gridItemHighlighted : ""}`}
          >
            <PricingCard
              plan={plan}
              onSelect={handleSelect}
              isLoading={pendingPlanId === plan.id}
              disabled={pendingPlanId !== null && pendingPlanId !== plan.id}
            />
          </div>
        ))}
      </div>

      {error ? <p className={s.error}>{error}</p> : null}
    </div>
  );
}

function SubscriptionPanelSkeleton() {
  return (
    <div className={s.wrapper} aria-hidden="true">
      <Skeleton className={s.statusSkeleton} rounded="lg" />
      <div className={s.grid}>
        <div className={`${s.gridItem} ${s.gridItemHighlighted}`}>
          <Skeleton className={s.cardSkeleton} rounded="lg" />
        </div>
        <div className={s.gridItem}>
          <Skeleton className={s.cardSkeleton} rounded="lg" />
        </div>
        <div className={s.gridItem}>
          <Skeleton className={s.cardSkeleton} rounded="lg" />
        </div>
      </div>
    </div>
  );
}
