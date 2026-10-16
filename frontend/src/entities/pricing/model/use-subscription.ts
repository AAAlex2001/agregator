"use client";

import { useEffect, useState } from "react";
import { getMySubscription } from "../api/get-my-subscription";
import { getPricingPlans } from "../api/get-pricing-plans";
import type { PricingPlan, UserSubscription } from "./types";

/** Тарифы, подписка аккаунта и ошибка их загрузки. */
interface SubscriptionState {
  plans: PricingPlan[] | null;
  subscription: UserSubscription | null;
  error: string | null;
}

/** Загружает тарифы и подписку для открытой вкладки текущего аккаунта. */
export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    plans: null,
    subscription: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getPricingPlans(), getMySubscription()])
      .then(([plans, subscription]) => {
        if (isActive) {
          setState({ plans, subscription, error: null });
        }
      })
      .catch(() => {
        if (isActive) {
          setState({
            plans: null,
            subscription: null,
            error: "Не удалось загрузить тарифы и подписку. Обновите страницу.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
