import type {
  ContactDealParty,
  ContactDealStatus,
  ContactReceiptData,
} from "@/source/entities/expert-contact";

const STATUS_LABELS: Record<ContactDealStatus, Record<"BUYER" | "SELLER" | "DEFAULT", string>> = {
  AWAITING_BUYER_SIGNATURE: {
    BUYER: "Подпишите договор",
    SELLER: "Ожидайте подписи покупателя",
    DEFAULT: "Ожидается подпись покупателя",
  },
  AWAITING_SELLER_SIGNATURE: {
    BUYER: "Ожидайте подписи эксперта",
    SELLER: "Подпишите договор",
    DEFAULT: "Ожидается подпись эксперта",
  },
  AWAITING_PAYMENT: {
    BUYER: "Оплатите и приложите чек",
    SELLER: "Ожидайте оплаты от покупателя",
    DEFAULT: "Ожидается оплата",
  },
  PAYMENT_REPORTED: {
    BUYER: "Ожидайте подтверждения оплаты",
    SELLER: "Проверьте оплату покупателя",
    DEFAULT: "Оплата ожидает проверки",
  },
  PAYMENT_REJECTED: {
    BUYER: "Загрузите новый чек",
    SELLER: "Ожидайте новый чек от покупателя",
    DEFAULT: "Чек отклонён",
  },
  CONTACTS_RELEASED: {
    BUYER: "Контакты эксперта доступны",
    SELLER: "Контакты переданы покупателю",
    DEFAULT: "Контакты открыты",
  },
  CANCELED: {
    BUYER: "Сделка отменена",
    SELLER: "Сделка отменена",
    DEFAULT: "Сделка отменена",
  },
};

const RECEIPT_STATUS_LABELS: Record<ContactReceiptData["status"], string> = {
  PENDING: "На проверке",
  APPROVED: "Подтверждён",
  REJECTED: "Отклонён",
  SUPERSEDED: "Заменён",
};

export function contactDealStatusLabel(
  status: ContactDealStatus,
  actorParty: ContactDealParty | null = null,
): string {
  const labels = STATUS_LABELS[status];
  return labels[actorParty ?? "DEFAULT"];
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
