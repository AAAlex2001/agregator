function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBaseUrl;
}

export interface CreatePaymentResponse {
  payment_id: number;
  confirmation_url: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface PaymentItem {
  id: number;
  yookassa_id: string | null;
  amount: number;
  payment_type: string;
  status: string;
  description: string;
  created_at: string;
}

export interface PaymentListResponse {
  items: PaymentItem[];
}

export async function createPayment(
  amountKopecks: number,
  returnUrl: string,
): Promise<CreatePaymentResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      amount: amountKopecks,
      return_url: returnUrl,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось создать платёж");
  }

  return response.json();
}

export async function fetchBalance(): Promise<number> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/payments/balance`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить баланс");
  }

  const data: BalanceResponse = await response.json();
  return data.balance;
}

export async function fetchPaymentHistory(): Promise<PaymentItem[]> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/payments/history`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить историю платежей");
  }

  const data: PaymentListResponse = await response.json();
  return data.items;
}

export interface WithdrawResponse {
  detail: string;
  payment_id: number;
  new_balance: number;
}

export async function withdrawFunds(
  amountKopecks: number,
  cardNumber: string,
): Promise<WithdrawResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/payments/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      amount: amountKopecks,
      card_number: cardNumber,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось создать заявку на вывод");
  }

  return response.json();
}

export async function refundPayment(paymentId: number): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/payments/refund`, {
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
