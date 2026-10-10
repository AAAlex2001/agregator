import { adminFetch, API_URL, jsonBody } from "@/shared/api";
import type { Deal, DealList } from "../model/types";

/** Сделки по покупке контактов, при необходимости — только одного статуса. */
export const fetchDeals = async (status: string): Promise<DealList> => {
  const params = new URLSearchParams();

  if (status) params.set("status", status);

  const response = await adminFetch(`/contact-deals?${params}`);

  return response.json();
};

/** Карточка сделки: договор, подписи, чеки и выдача контактов. */
export const fetchDeal = async (id: number): Promise<Deal> => {
  const response = await adminFetch(`/contact-deals/${id}`);

  return response.json();
};

/** Выдать контакты покупателю вручную с пояснением для журнала. */
export const releaseDeal = async (id: number, note: string): Promise<Deal> => {
  const response = await adminFetch(`/contact-deals/${id}/release`, jsonBody("POST", { note }));

  return response.json();
};

/** Адрес файла чека — открывается через прокси админки. */
export const receiptUrl = (dealId: number, receiptId: number) =>
  `${API_URL}/contact-deals/${dealId}/receipts/${receiptId}`;
