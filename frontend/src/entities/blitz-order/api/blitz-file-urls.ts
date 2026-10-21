import { API_URL } from "@/shared/config/api";
import type { BlitzPaper } from "../model/types";

/** Адрес файла заявки. */
export function blitzDocumentUrl(orderId: number, documentId: number): string {
  return `${API_URL}/blitz/orders/${orderId}/documents/${documentId}`;
}

/** Адрес договора или соглашения: проект до подписи, подписанный файл после. */
export function blitzPaperUrl(orderId: number, paper: BlitzPaper): string {
  return `${API_URL}/blitz/orders/${orderId}/papers/${paper}`;
}

/** Адрес счёта в PDF. */
export function blitzInvoiceUrl(orderId: number, invoiceId: number): string {
  return `${API_URL}/blitz/orders/${orderId}/invoices/${invoiceId}/pdf`;
}

/** Адрес акта в PDF. */
export function blitzActUrl(orderId: number): string {
  return `${API_URL}/blitz/orders/${orderId}/act`;
}
