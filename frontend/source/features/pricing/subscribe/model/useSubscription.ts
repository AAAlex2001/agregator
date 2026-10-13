"use client";

import { useEffect, useState } from "react";
import {
  fetchMySubscription,
  fetchPricingPlans,
  type PricingPlan,
  type UserSubscription,
} from "@/source/entities/pricing";

/** Загружает тарифы и текущую подписку. */
export function useSubscription() {
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    async function load() {
      try {
        const [plansResult, subscriptionResult] = await Promise.all([
          fetchPricingPlans(),
          fetchMySubscription(),
        ]);
        if (disposed) return;

        setPlans(plansResult);
        setSubscription(subscriptionResult);
      } catch {
        if (disposed) return;
        setError("Не удалось загрузить тарифы и подписку. Обновите страницу.");
      }
    }

    void load();
    return () => {
      disposed = true;
    };
  }, []);

  return { plans, subscription, error };
}
