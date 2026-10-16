import type { PricingCardState, PricingPlan, UserSubscription } from "./types";

/** Порядок тарифов для определения доступного повышения подписки. */
const SUBSCRIPTION_TIERS = {
  SINGLE: 1,
  MONTHLY: 2,
  YEARLY: 3,
};

/** Определяет выбранный тариф и доступность остальных с учётом оплаты. */
export function getPricingCardState(
  plan: PricingPlan,
  subscription: UserSubscription | null,
): PricingCardState {
  if (!subscription || subscription.payment_pending) {
    return "available";
  }

  if (subscription.kind === plan.kind) {
    return "active";
  }

  if (SUBSCRIPTION_TIERS[plan.kind] < SUBSCRIPTION_TIERS[subscription.kind]) {
    return "disabled";
  }

  return "available";
}
