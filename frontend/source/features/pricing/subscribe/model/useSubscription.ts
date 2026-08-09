"use client";

import { useEffect, useState } from "react";
import {
  fetchMySubscription,
  fetchPricingPlans,
  type PricingPlan,
  type UserSubscription,
} from "@/source/entities/pricing";

export function useSubscription() {
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

  return { plans, subscription };
}
