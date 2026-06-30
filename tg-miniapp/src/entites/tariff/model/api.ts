import { apiJson } from "@/shared/services/api";

export interface Plan {
  id: number;
  name: string;
  badge: string | null;
  price_display: string;
  period_label: string;
  description: string;
  cta_label: string;
  features: string[];
  highlighted: boolean;
}

export interface SubscribeResult {
  subscription_id: number;
  confirmation_url: string;
}

export const listPlans = () => apiJson<{ plans: Plan[] }>("/pricing/");

export const subscribe = (planId: number, returnUrl: string) =>
  apiJson<SubscribeResult>("/pricing/subscribe", {
    method: "POST",
    body: JSON.stringify({ plan_id: planId, return_url: returnUrl }),
  });
