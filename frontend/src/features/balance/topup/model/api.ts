import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";
import type {
  CreatePaymentResponse,
  BalanceResponse,
  PaymentItem,
  PaymentListResponse,
} from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function createPayment(
  amountKopecks: number,
  returnUrl: string,
): Promise<CreatePaymentResponse> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ amount: amountKopecks, return_url: returnUrl }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось создать платёж");
  }

  return response.json();
}

export async function fetchBalance(): Promise<number> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/payments/balance`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Не удалось загрузить баланс");
  const data: BalanceResponse = await response.json();
  return data.balance;
}

export async function fetchPaymentHistory(): Promise<PaymentItem[]> {
  const response = await fetchWithSessionRefresh(`${getApiBaseUrl()}/payments/history`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Не удалось загрузить историю платежей");
  const data: PaymentListResponse = await response.json();
  return data.items;
}
