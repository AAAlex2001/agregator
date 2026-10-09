import type { Deal, DealListItem } from "@/entities/contact-deal";
import { adminRequest, API_URL, jsonBody } from "@/shared/api";

type DealList = {
  items: DealListItem[];
  total: number;
};

/** Сделки по покупке контактов, при необходимости — только одного статуса. */
export const fetchDeals = (status: string) => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  return adminRequest<DealList>(`/contact-deals?${params}`);
};

/** Карточка сделки: договор, подписи, чеки и выдача контактов. */
export const fetchDeal = (id: number) => adminRequest<Deal>(`/contact-deals/${id}`);

/** Выдать контакты покупателю вручную с пояснением для журнала. */
export const releaseDeal = (id: number, note: string) =>
  adminRequest<Deal>(`/contact-deals/${id}/release`, jsonBody("POST", { note }));

/** Адрес файла чека — открывается через прокси админки. */
export const receiptUrl = (dealId: number, receiptId: number) => `${API_URL}/contact-deals/${dealId}/receipts/${receiptId}`;
