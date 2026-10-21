import { request } from "@/shared/api/request";

/** Ссылка на страницу оплаты картой. */
interface PaymentLink {
  confirmation_url: string;
}

/** Ссылка на оплату текущего этапа картой. */
export async function createBlitzPayment(orderId: number): Promise<string> {
  const response = await request(`/blitz/orders/${orderId}/payment`, {
    method: "POST",
    errorMessage: "Не удалось перейти к оплате",
  });
  const link: PaymentLink = await response.json();

  return link.confirmation_url;
}
