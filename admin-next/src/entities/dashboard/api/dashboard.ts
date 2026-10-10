import { adminFetch } from "@/shared/api";
import type { Dashboard } from "../model/types";

/** Сводка платформы: регистрации, заказы и отклики — счётчики, динамика за 30 дней и распределения. */
export const fetchDashboard = async (): Promise<Dashboard> => {
  const response = await adminFetch("/dashboard");

  return response.json();
};
