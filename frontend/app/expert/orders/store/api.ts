import type { OrdersListResponse } from "./types";
import { fetchWithSessionRefresh } from "@/app/utils/sessionAuth";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function fetchOrders(skip = 0, limit = 50): Promise<OrdersListResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/orders/?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Не удалось загрузить заказы";
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) {
        message = body.detail;
      }
    } catch {
    }
    throw new Error(message);
  }

  return (await response.json()) as OrdersListResponse;
}
