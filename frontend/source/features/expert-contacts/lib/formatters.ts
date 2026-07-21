import type { ContactDealStatus, ContactReceiptData } from "@/source/entities/expert-contact";

const STATUS_LABELS: Record<ContactDealStatus, string> = {
  AWAITING_BUYER_SIGNATURE: "Ожидает подписи покупателя",
  AWAITING_SELLER_SIGNATURE: "Ожидает подписи эксперта",
  AWAITING_PAYMENT: "Ожидает оплаты",
  PAYMENT_REPORTED: "Чек на проверке",
  PAYMENT_REJECTED: "Чек отклонён",
  CONTACTS_RELEASED: "Контакты открыты",
  CANCELED: "Отменена",
};

const RECEIPT_STATUS_LABELS: Record<ContactReceiptData["status"], string> = {
  PENDING: "На проверке",
  APPROVED: "Подтверждён",
  REJECTED: "Отклонён",
  SUPERSEDED: "Заменён",
};

export function contactDealStatusLabel(status: ContactDealStatus): string {
  return STATUS_LABELS[status];
}

export function contactReceiptStatusLabel(status: ContactReceiptData["status"]): string {
  return RECEIPT_STATUS_LABELS[status];
}

export function certificateLabel(certificate: {
  area?: string;
  object?: string;
  category?: string;
}): string {
  return [certificate.area, certificate.object, certificate.category]
    .filter(Boolean)
    .join(" · ");
}

export function formatDealDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
