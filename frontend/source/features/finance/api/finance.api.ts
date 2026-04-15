import { fetchWithSession } from "@/source/shared/api/session";
import type {
  PaymentItem,
  PaymentListResponse,
  CreatePaymentResponse,
  WithdrawResponse,
} from "@/source/entities/payment";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchPaymentHistory(): Promise<PaymentItem[]> {
  const res = await fetchWithSession(`${API}/payments/history`);
  if (!res.ok) throw new Error("Не удалось загрузить историю платежей");
  const data: PaymentListResponse = await res.json();
  return data.items;
}

export async function createPayment(
  amountKopecks: number,
  returnUrl: string,
): Promise<CreatePaymentResponse> {
  const res = await fetchWithSession(`${API}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountKopecks, return_url: returnUrl }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось создать платёж");
  }
  return res.json();
}

export async function withdrawFunds(
  amountKopecks: number,
  cardNumber: string,
): Promise<WithdrawResponse> {
  const res = await fetchWithSession(`${API}/payments/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountKopecks, card_number: cardNumber }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось создать заявку на вывод");
  }
  return res.json();
}
