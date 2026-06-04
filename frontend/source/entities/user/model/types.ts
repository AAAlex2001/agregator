export interface EmailPreferences {
  email_on_response_created: boolean;
  email_on_response_updated: boolean;
  email_on_expert_rejected: boolean;
  email_on_order_updated: boolean;
  email_on_bidding_finished: boolean;
  email_on_chat_message: boolean;
  email_on_question_asked: boolean;
  email_on_question_answered: boolean;
}

export interface CompanyData {
  value?: string;
  unrestricted_value?: string;
  data?: {
    inn?: string | null;
    name?: { full_with_opf?: string | null; short_with_opf?: string | null } | null;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export type LicenseRentalKind = "PERCENT" | "FIXED" | "NEGOTIABLE";

export interface LicenseHolderRegisterPayload {
  email: string;
  password: string;
  phone: string;
  inn: string;
  company_data: Record<string, unknown>;
  license_number: string;
  license_areas: string[];
  license_rental_kind: LicenseRentalKind;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
}

export interface LicenseHolderUpdatePayload {
  license_number: string;
  license_areas: string[];
  license_rental_kind: LicenseRentalKind;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
}

export interface UserProfile {
  id: number;
  inn: string | null;
  company_data: CompanyData | null;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  rating: number | null;
  review_count: number;
  role: string;
  email_preferences: EmailPreferences;
  notify_order_types: string[];
  notifications_introduced: boolean;
  license_number: string | null;
  license_file_url: string | null;
  license_areas: string[] | null;
  license_rental_kind: LicenseRentalKind | null;
  license_rental_percent: number | null;
  license_rental_fixed_amount: number | null;
  company_card_url: string | null;
}
