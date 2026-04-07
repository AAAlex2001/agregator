import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";
import type { WithdrawResponse } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function withdrawFunds(
  amountKopecks: number,
  cardNumber: string,
): Promise<WithdrawResponse> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/payments/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ amount: amountKopecks, card_number: cardNumber }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось создать заявку на вывод");
  }

  return response.json();
}

export async function refundPayment(paymentId: number): Promise<void> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/payments/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ payment_id: paymentId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось выполнить возврат");
  }
}
