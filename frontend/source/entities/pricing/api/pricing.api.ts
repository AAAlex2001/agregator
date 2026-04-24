import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { PricingPlan, UserSubscription } from "../model/types";

interface PricingListResponse {
  plans: PricingPlan[];
}

interface SubscribeResponse {
  subscription_id: number;
  confirmation_url: string;
}

export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const base = typeof window === "undefined" ? SERVER_API_URL : API_URL;
  const response = await fetch(`${base}/pricing/`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }
  const payload = (await response.json()) as PricingListResponse;
  return payload.plans ?? [];
}

export async function subscribeToPlan(planId: number, returnUrl: string): Promise<SubscribeResponse> {
  const response = await fetchWithSession(`${API_URL}/pricing/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan_id: planId, return_url: returnUrl }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Не удалось оформить подписку");
  }
  return (await response.json()) as SubscribeResponse;
}

export async function fetchMySubscription(): Promise<UserSubscription | null> {
  const response = await fetchWithSession(`${API_URL}/pricing/my-subscription`);
  if (!response.ok) {
    return null;
  }
  const payload = await response.json();
  if (!payload) return null;
  return payload as UserSubscription;
}
