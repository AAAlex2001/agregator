"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/shared/ui/Notifications";
import type { PricingPlan } from "@/source/entities/pricing";
import { subscribeToPlan } from "../api/pricing.api";

interface Options {
  returnPath?: string;
}

export function useSubscribeToPlan({ returnPath = "/settings?section=subscription" }: Options = {}) {
  const router = useRouter();
  const { showError } = useNotifications();
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);

  const select = async (plan: PricingPlan) => {
    setPendingPlanId(plan.id);
    try {
      const returnUrl = `${window.location.origin}${returnPath}`;
      const result = await subscribeToPlan(plan.id, returnUrl);
      window.location.href = result.confirmation_url;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Не удалось оформить подписку";
      if (message.toLowerCase().includes("unauthor") || message.includes("401")) {
        router.push("/login");
        return;
      }
      showError(message);
      setPendingPlanId(null);
    }
  };

  return {
    select,
    pendingPlanId,
    isSubmitting: pendingPlanId !== null,
  };
}
