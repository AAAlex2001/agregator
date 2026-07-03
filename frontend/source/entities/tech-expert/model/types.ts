export type TechExpertTipType = "string" | "document" | "number" | "type" | "department";

export interface TechExpertTip {
  id: number;
  value: string;
  type: TechExpertTipType;
}

export type TechExpertAccess = "full" | "card" | "restricted" | string;

export interface TechExpertDocument {
  id: number;
  name: string;
  status: string | null;
  doctype: string;
  number: string | null;
  date: string | null;
  department: string;
  access: TechExpertAccess;
}

export interface TechExpertDocumentsResult {
  items: TechExpertDocument[];
  total: number;
}

export interface TechExpertDocumentCard {
  id: number;
  name: string;
  status: string | null;
  doctype: string;
  number: string | null;
  date: string | null;
  department: string;
  access: TechExpertAccess;
  access_reason: string | null;
  is_important: boolean;
  is_favorite: boolean;
  is_purchased: boolean;
  price: number;
  edition_date: string | null;
  change_date: string | null;
  action_start_date: string | null;
  action_end_date: string | null;
  certificate_number: string | null;
  certificate_date: string | null;
  mu_number: string | null;
  mu_date: string | null;
  in_product_created: string | null;
  in_product_updated: string | null;
  has_text: boolean;
  has_pdf: boolean;
  has_scan: boolean;
  has_html: boolean;
  has_attachments: boolean;
  publications: string[];
}
