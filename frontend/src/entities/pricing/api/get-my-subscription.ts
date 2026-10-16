import { request } from "@/shared/api/request";
import type { UserSubscription } from "../model/types";

/** Загружает текущую подписку или null, если пользователь её ещё не оформил. */
export async function getMySubscription(): Promise<UserSubscription | null> {
  const response = await request("/pricing/my-subscription", {
    errorMessage: "Не удалось загрузить подписку",
  });

  return response.json();
}
