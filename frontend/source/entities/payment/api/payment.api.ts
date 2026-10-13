import { json, send } from "@/source/shared/api/request";

export async function createPayment(amount: number, returnUrl: string): Promise<{ confirmation_url: string }> {
  const response = await send("/payments/create", json("POST", { amount, return_url: returnUrl }), "Ошибка создания платежа");
  return response.json();
}
