import type { CompanyData } from "./types";
import type { ExpertCertificate } from "@/source/entities/expertise";

export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

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
  expert_is_attested?: boolean;
  expert_certificates?: ExpertCertificate[] | null;
  expert_show_on_map?: boolean;
  expert_map_fields?: string[] | null;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
