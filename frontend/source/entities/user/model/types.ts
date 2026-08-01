import type { ExpertCertificate } from "@/source/entities/expertise";

export interface EmailPreferences {
  email_on_response_created: boolean;
  email_on_response_updated: boolean;
  email_on_expert_rejected: boolean;
  email_on_order_updated: boolean;
  email_on_bidding_finished: boolean;
  email_on_chat_message: boolean;
  email_on_question_asked: boolean;
  email_on_question_answered: boolean;
  email_on_new_blog_post: boolean;
  email_on_labor_listing: boolean;
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
  company_data: CompanyData;
  license_number: string;
  license_areas: string[];
  license_rental_kind: LicenseRentalKind;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
  mining_license_number?: string | null;
  lab_accreditation_number?: string | null;
}

export interface LicenseHolderUpdatePayload {
  license_number: string;
  license_areas: string[];
  license_rental_kind: LicenseRentalKind;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
  mining_license_number?: string | null;
  lab_accreditation_number?: string | null;
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
  position: string;
  opo_license_number: string | null;
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
  mining_license_number: string | null;
  mining_license_file_url: string | null;
  sro_design_file_url: string | null;
  lab_accreditation_number: string | null;
  lab_accreditation_file_url: string | null;
  company_card_url: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  location_city: string | null;
  travels_to_other_regions: boolean;
  expert_certificates: ExpertCertificate[] | null;
  expert_show_on_map: boolean;
  expert_map_fields: string[] | null;
}
