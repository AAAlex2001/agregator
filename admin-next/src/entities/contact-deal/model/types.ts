import type { BadgeTone } from "@/shared/ui/badge";

export type DealStatus =
  | "AWAITING_BUYER_SIGNATURE"
  | "AWAITING_SELLER_SIGNATURE"
  | "AWAITING_PAYMENT"
  | "PAYMENT_REPORTED"
  | "PAYMENT_REJECTED"
  | "CONTACTS_RELEASED"
  | "CANCELED";

export type DealParty = "SELLER" | "BUYER";

export type SignatureMethod = "PASSWORD" | "TELEGRAM";

export type ReceiptStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUPERSEDED";

export type ReleaseActor = "SELLER" | "ADMIN";

export type DealListItem = {
  id: number;
  public_id: string;
  seller_id: number;
  status: DealStatus;
  seller_name: string;
  buyer_name: string;
  price_rubles: number;
  actor_party: DealParty | null;
  receipt_count: number;
  created_at: string;
  updated_at: string;
};

export type DealContract = {
  title: string;
  number: string;
  date: string;
  preamble: string;
  clauses: string[];
  seller_requisites: Record<string, string> | string;
  buyer_requisites: Record<string, string> | string;
};

export type DealSignature = {
  party: DealParty;
  method: SignatureMethod;
  signer_name: string;
  document_hash: string;
  signed_at: string;
};

export type DealReceipt = {
  id: number;
  public_id: string;
  original_name: string;
  content_type: string;
  size_bytes: number;
  sha256: string;
  status: ReceiptStatus;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  download_url: string;
};

export type DealList = {
  items: DealListItem[];
  total: number;
};

export type Deal = {
  id: number;
  public_id: string;
  seller_id: number;
  status: DealStatus;
  seller_name: string;
  buyer_name: string;
  price_rubles: number;
  actor_party: DealParty | null;
  created_at: string;
  updated_at: string;
  contract: DealContract;
  contract_hash: string;
  signatures: DealSignature[];
  receipts: DealReceipt[];
  payment_details: string | null;
  seller_contacts: { phone?: string | null; email?: string | null } | null;
  buyer_reported_paid_at: string | null;
  seller_confirmed_at: string | null;
  released_at: string | null;
  released_by: ReleaseActor | null;
  release_note: string | null;
};

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  AWAITING_BUYER_SIGNATURE: "Ждёт подписи покупателя",
  AWAITING_SELLER_SIGNATURE: "Ждёт подписи исполнителя",
  AWAITING_PAYMENT: "Ждёт оплаты",
  PAYMENT_REPORTED: "Оплата заявлена",
  PAYMENT_REJECTED: "Оплата отклонена",
  CONTACTS_RELEASED: "Контакты выданы",
  CANCELED: "Отменена",
};

export const DEAL_STATUS_TONES: Record<DealStatus, BadgeTone> = {
  AWAITING_BUYER_SIGNATURE: "neutral",
  AWAITING_SELLER_SIGNATURE: "neutral",
  AWAITING_PAYMENT: "info",
  PAYMENT_REPORTED: "warning",
  PAYMENT_REJECTED: "danger",
  CONTACTS_RELEASED: "success",
  CANCELED: "neutral",
};

export const PARTY_LABELS: Record<DealParty, string> = {
  SELLER: "Исполнитель",
  BUYER: "Покупатель",
};

export const SIGNATURE_METHOD_LABELS: Record<SignatureMethod, string> = {
  PASSWORD: "Пароль",
  TELEGRAM: "Telegram",
};

export const RECEIPT_STATUS_LABELS: Record<ReceiptStatus, string> = {
  PENDING: "На проверке",
  APPROVED: "Принят",
  REJECTED: "Отклонён",
  SUPERSEDED: "Заменён",
};

export const RECEIPT_STATUS_TONES: Record<ReceiptStatus, BadgeTone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  SUPERSEDED: "neutral",
};

export const RELEASE_ACTOR_LABELS: Record<ReleaseActor, string> = {
  SELLER: "исполнителем",
  ADMIN: "администратором",
};
