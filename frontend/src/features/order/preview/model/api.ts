import type { OrderData } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function fetchPublicOrder(uuid: string): Promise<OrderData> {
  const res = await fetch(`${getApiBaseUrl()}/orders/public/${uuid}`);
  if (!res.ok) throw new Error("Заказ не найден");
  return res.json();
}
