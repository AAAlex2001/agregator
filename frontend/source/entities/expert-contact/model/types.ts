export type ContactDealStatus =
  | "AWAITING_BUYER_SIGNATURE"
  | "AWAITING_SELLER_SIGNATURE"
  | "AWAITING_PAYMENT"
  | "PAYMENT_REPORTED"
  | "PAYMENT_REJECTED"
  | "CONTACTS_RELEASED"
  | "CANCELED";

export type ContactDealParty = "SELLER" | "BUYER";

export interface ExpertContactCardData {
  id: number;
  public_id: string;
  name: string;
  avatar_url: string | null;
  city: string | null;
  certificates: Array<{
    area?: string;
    object?: string;
    category?: string;
    expires_at?: string;
  }>;
  rating: number | null;
  review_count: number;
  masked_phone: string | null;
  masked_email: string | null;
  phone: string | null;
  email: string | null;
  sales_enabled: boolean;
  price_rubles: number | null;
  is_mine: boolean;
  deal_id: number | null;
  deal_status: ContactDealStatus | null;
}

export interface ExpertContactOfferData {
  enabled: boolean;
  price_rubles: number | null;
  has_payment_details: boolean;
  consent_at: string | null;
}

export interface ContactDealListItem {
  id: number;
  public_id: string;
  seller_id: number;
  status: ContactDealStatus;
  seller_name: string;
  buyer_name: string;
  price_rubles: number;
  actor_party: ContactDealParty | null;
  created_at: string;
  updated_at: string;
}

export interface ContactDealSignature {
  party: ContactDealParty;
  method: "PASSWORD" | "TELEGRAM";
  signer_name: string;
  document_hash: string;
  signed_at: string;
}

export interface ContactReceiptData {
  id: number;
  public_id: string;
  original_name: string;
  content_type: string;
  size_bytes: number;
  sha256: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUPERSEDED";
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  download_url: string;
}

export interface ContactContractData {
  version: string;
  title: string;
  number: string;
  date: string;
  seller_name: string;
  seller_area: string;
  buyer_name: string;
  price_rubles: number;
  preamble: string;
  clauses: string[];
  seller_requisites: Record<string, string>;
  buyer_requisites: Record<string, string>;
}

export interface ContactDealDetail extends ContactDealListItem {
  contract: ContactContractData;
  contract_hash: string;
  signatures: ContactDealSignature[];
  receipts: ContactReceiptData[];
  payment_details: string | null;
  seller_contacts: { phone: string | null; email: string | null } | null;
  buyer_reported_paid_at: string | null;
  seller_confirmed_at: string | null;
  released_at: string | null;
  released_by: "SELLER" | "ADMIN" | null;
  release_note: string | null;
}
