export type SubscriptionKind = "SINGLE" | "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "USED";

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
}
