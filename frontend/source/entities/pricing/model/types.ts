export type SubscriptionKind = "SINGLE" | "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "USED";

export interface PricingPlan {
  id: number;
  kind: SubscriptionKind;
  name: string;
  badge: string | null;
  price_kopecks: number;
  price_display: string;
  period_label: string;
  duration_days: number | null;
  description: string;
  cta_label: string;
  features: string[];
  highlighted: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id: number;
  plan_id: number;
  plan_name: string;
  kind: SubscriptionKind;
  status: SubscriptionStatus;
  activated_at: string;
  expires_at: string | null;
  responses_remaining: number | null;
  payment_pending: boolean;
  active_label: string;
}

export type PricingCardState = "available" | "active" | "disabled";

export const SUBSCRIPTION_TIER: Record<SubscriptionKind, number> = {
  SINGLE: 1,
  MONTHLY: 2,
  YEARLY: 3,
};

export function derivePricingCardState(
  plan: PricingPlan,
  subscription: UserSubscription | null,
): PricingCardState {
  if (!subscription || subscription.payment_pending) return "available";
  if (subscription.kind === plan.kind) return "active";
  if (SUBSCRIPTION_TIER[plan.kind] < SUBSCRIPTION_TIER[subscription.kind]) return "disabled";
  return "available";
}
