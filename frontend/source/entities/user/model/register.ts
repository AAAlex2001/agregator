import type { CompanyData } from "./types";

export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export interface DirectionRegistration {
  key: string;
  data: Record<string, unknown>;
}

export interface RegisterApiPayload {
  role: UserRole;
  email: string;
  password: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  inn?: string;
  company_data?: CompanyData | null;
  location_lat?: number | null;
  location_lng?: number | null;
  location_address?: string | null;
  location_city?: string | null;
  travels_to_other_regions?: boolean;
  show_on_map?: boolean;
  map_fields?: string[];
  directions?: DirectionRegistration[];
  contact_sales_enabled?: boolean;
  contact_price_rubles?: number;
  contact_payment_details?: string;
  contact_disclosure_consent?: boolean;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
