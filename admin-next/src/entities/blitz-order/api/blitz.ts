import { adminFetch, API_URL, jsonBody } from "@/shared/api";
import type {
  BlitzAdminInvoice,
  BlitzCatalog,
  BlitzExpertOption,
  BlitzOrder,
  BlitzOrderList,
  BlitzStatus,
  BlitzTariff,
  BlitzTariffCell,
  BlitzTeamMember,
} from "../model/types";

/** Заявки, новые первыми. Пустой список статусов — все. */
export const fetchBlitzOrders = async (
  statuses: BlitzStatus[],
  limit: number,
  offset: number,
  signal: AbortSignal,
): Promise<BlitzOrderList> => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  statuses.forEach((status) => params.append("status", status));

  const response = await adminFetch(`/blitz/orders?${params}`, { signal });

  return response.json();
};

/** Заявка со всеми файлами, счетами и историей. */
export const fetchBlitzOrder = async (id: number, signal: AbortSignal): Promise<BlitzOrder> => {
  const response = await adminFetch(`/blitz/orders/${id}`, { signal });

  return response.json();
};

/** Эксперты для назначения: подходящие по удостоверениям — первыми. */
export const fetchBlitzExperts = async (id: number, signal: AbortSignal): Promise<BlitzExpertOption[]> => {
  const response = await adminFetch(`/blitz/orders/${id}/experts`, { signal });

  return response.json();
};

/** Поставить статус вручную с пояснением для сторон. */
export const setBlitzStatus = async (id: number, status: BlitzStatus, note: string): Promise<BlitzOrder> => {
  const response = await adminFetch(`/blitz/orders/${id}/status`, jsonBody("POST", { status, note: note || null }));

  return response.json();
};

/** Назначить эксперта и, если нужно, вид договора. */
export const assignBlitzExpert = async (
  id: number,
  expertId: number,
  contractKind: string,
): Promise<BlitzOrder> => {
  const body = { expert_id: expertId, contract_kind: contractKind || null };
  const response = await adminFetch(`/blitz/orders/${id}/expert`, jsonBody("POST", body));

  return response.json();
};

/** Поменять цену заявки с причиной. */
export const changeBlitzPrice = async (id: number, price: number, reason: string): Promise<BlitzOrder> => {
  const response = await adminFetch(`/blitz/orders/${id}/price`, jsonBody("PUT", { price, reason }));

  return response.json();
};

/** Отменить заявку с причиной. */
export const cancelBlitzOrder = async (id: number, reason: string): Promise<BlitzOrder> => {
  const response = await adminFetch(`/blitz/orders/${id}/cancel`, jsonBody("POST", { reason }));

  return response.json();
};

/** Удалить заявку вместе с файлами. */
export const deleteBlitzOrder = async (id: number): Promise<void> => {
  await adminFetch(`/blitz/orders/${id}`, { method: "DELETE" });
};

/** Счета: только ждущие оплаты или все. */
export const fetchBlitzInvoices = async (onlyOpen: boolean, signal: AbortSignal): Promise<BlitzAdminInvoice[]> => {
  const response = await adminFetch(`/blitz/invoices?open=${onlyOpen}`, { signal });

  return response.json();
};

/** Подтвердить, что деньги по счёту пришли. */
export const confirmBlitzInvoice = async (id: number): Promise<BlitzAdminInvoice> => {
  const response = await adminFetch(`/blitz/invoices/${id}/confirm`, { method: "POST" });

  return response.json();
};

/** Справочник областей и объектов. */
export const fetchBlitzCatalog = async (signal: AbortSignal): Promise<BlitzCatalog> => {
  const response = await adminFetch("/blitz/catalog", { signal });

  return response.json();
};

/** Текущие тарифы. */
export const fetchBlitzTariffs = async (signal: AbortSignal): Promise<BlitzTariff[]> => {
  const response = await adminFetch("/blitz/tariffs", { signal });

  return response.json();
};

/** Сохранить сетку тарифов целиком. Пустая цена удаляет тариф. */
export const saveBlitzTariffs = async (items: BlitzTariffCell[]): Promise<BlitzTariff[]> => {
  const response = await adminFetch("/blitz/tariffs", jsonBody("PUT", { items }));

  return response.json();
};

/** Тариф аудита СУПБ или null, если не задан. */
export const fetchAuditTariff = async (signal: AbortSignal): Promise<number | null> => {
  const response = await adminFetch("/blitz/tariffs/audit", { signal });
  const tariff: { price: number | null } = await response.json();

  return tariff.price;
};

/** Задать тариф аудита не ниже 100 000 ₽ или убрать его пустой ценой. */
export const saveAuditTariff = async (price: number | null): Promise<number | null> => {
  const response = await adminFetch("/blitz/tariffs/audit", jsonBody("PUT", { price }));
  const tariff: { price: number | null } = await response.json();

  return tariff.price;
};

/** Эксперты с анкетой аудитора и признак руководителя группы. */
export const fetchBlitzAuditors = async (signal: AbortSignal): Promise<BlitzTeamMember[]> => {
  const response = await adminFetch("/blitz/auditors", { signal });

  return response.json();
};

/** Назначить аудитора руководителем группы или снять с этой роли. */
export const setBlitzAuditLead = async (accountId: number, lead: boolean): Promise<BlitzTeamMember> => {
  const response = await adminFetch(`/blitz/auditors/${accountId}/lead`, jsonBody("PUT", { lead }));

  return response.json();
};

/** Адрес файла заявки через прокси админки. */
export const blitzDocumentUrl = (orderId: number, documentId: number) =>
  `${API_URL}/blitz/orders/${orderId}/documents/${documentId}`;

/** Адрес счёта в PDF через прокси админки. */
export const blitzInvoiceUrl = (invoiceId: number) => `${API_URL}/blitz/invoices/${invoiceId}/pdf`;
