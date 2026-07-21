export type ContactDealStatus =
  | "AWAITING_BUYER_SIGNATURE"
  | "AWAITING_SELLER_SIGNATURE"
  | "AWAITING_PAYMENT"
  | "PAYMENT_REPORTED"
  | "PAYMENT_REJECTED"
  | "CONTACTS_RELEASED"
  | "CANCELED";

export interface AdminContactDealListItem {
  id: number;
  public_id: string;
  seller_id: number;
  status: ContactDealStatus;
  seller_name: string;
  buyer_name: string;
  price_rubles: number;
  actor_party: null;
  receipt_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminContactDealDetail extends Omit<AdminContactDealListItem, "receipt_count"> {
  contract: {
    title: string;
    number: string;
    date: string;
    preamble: string;
    clauses: string[];
    seller_requisites: Record<string, string>;
    buyer_requisites: Record<string, string>;
  };
  contract_hash: string;
  signatures: Array<{
    party: "SELLER" | "BUYER";
    method: "PASSWORD" | "TELEGRAM";
    signer_name: string;
    document_hash: string;
    signed_at: string;
  }>;
  receipts: Array<{
    id: number;
    original_name: string;
    content_type: string;
    size_bytes: number;
    sha256: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "SUPERSEDED";
    rejection_reason: string | null;
    created_at: string;
    download_url: string;
  }>;
  payment_details: string | null;
  seller_contacts: { phone: string | null; email: string | null } | null;
  released_at: string | null;
  released_by: "SELLER" | "ADMIN" | null;
  release_note: string | null;
}
