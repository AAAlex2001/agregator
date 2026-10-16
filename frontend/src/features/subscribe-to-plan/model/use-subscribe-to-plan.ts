"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToPlan } from "@/entities/pricing";
import type { PricingPlan } from "@/entities/pricing";
import { useNotifications } from "@/shared/ui/notifications";

/** Страница возврата после подтверждения оплаты подписки. */
interface SubscribeToPlanOptions {
  returnPath?: string;
}

/** Оформляет выбранный тариф и переводит пользователя на подтверждение оплаты. */
export function useSubscribeToPlan({
  returnPath = "/settings?section=subscription",
}: SubscribeToPlanOptions = {}) {
  const router = useRouter();
  const { showError } = useNotifications();
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);

  /** Открывает оплату; при недействующей сессии возвращает на главную. */
  async function select(plan: PricingPlan) {
    if (pendingPlanId !== null) {
      return;
    }

    setPendingPlanId(plan.id);

    try {
      const returnUrl = `${window.location.origin}${returnPath}`;
      const result = await subscribeToPlan(plan.id, returnUrl);

      window.location.href = result.confirmation_url;
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Не удалось оформить подписку";

      if (message.toLowerCase().includes("unauthor") || message.includes("401")) {
        router.push("/");
        return;
      }

      showError(message);
      setPendingPlanId(null);
    }
  }

  return {
    select,
    pendingPlanId,
    isSubmitting: pendingPlanId !== null,
  };
}
