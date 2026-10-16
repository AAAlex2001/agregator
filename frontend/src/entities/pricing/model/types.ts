/** Период действия тарифа: один отклик, месяц или год. */
export type SubscriptionKind = "SINGLE" | "MONTHLY" | "YEARLY";

/** Публичный тариф с ценой и текстами карточки из API. */
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

/** Ответ публичного API со списком доступных тарифов. */
export interface PricingPlansResponse {
  plans: PricingPlan[];
}

/** Доступность выбора тарифа с учётом действующей подписки. */
export type PricingCardState = "available" | "active" | "disabled";

/** Подписка текущего пользователя и доступный остаток откликов. */
export interface UserSubscription {
  id: number;
  plan_id: number;
  plan_name: string;
  kind: SubscriptionKind;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "USED";
  activated_at: string;
  expires_at: string | null;
  responses_remaining: number | null;
  payment_pending: boolean;
  active_label: string;
}

/** Созданная подписка и адрес подтверждения её оплаты. */
export interface SubscribeResponse {
  subscription_id: number;
  confirmation_url: string;
}
