import type { OrdersListResponse } from "./types";

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBaseUrl;
}

export async function fetchOrders(skip = 0, limit = 50): Promise<OrdersListResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const query = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });

  const response = await fetch(`${apiBaseUrl}/orders/?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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
