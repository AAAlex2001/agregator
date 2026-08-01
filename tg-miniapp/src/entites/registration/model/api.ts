import { apiJson, type Role } from "@/shared/services/api";
import type { Party } from "@/entites/party";

export type RentalKind = "PERCENT" | "FIXED" | "NEGOTIABLE";

export interface Certificate {
  area: string;
  object: string;
  category: string;
}

export interface RegisterPayload {
  role: Role;
  email: string;
  password: string;
  phone?: string;
  inn?: string;
  company_data?: Party | null;
  first_name?: string;
  last_name?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  location_city?: string;
  travels_to_other_regions?: boolean;
  expert_certificates?: Certificate[];
  expert_show_on_map?: boolean;
  expert_map_fields?: string[];
}

export interface LicensePayload {
  email: string;
  password: string;
  phone: string;
  inn: string;
  company_data: Party;
  license_number: string;
  license_areas: string[];
  license_rental_kind: RentalKind;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
  mining_license_number?: string | null;
  lab_accreditation_number?: string | null;
}

export interface LicenseFiles {
  license: File | null;
  mining: File | null;
  sro: File | null;
  lab: File | null;
}

export function registerUser(payload: RegisterPayload): Promise<{ id: number }> {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  return apiJson("/register/", { method: "POST", body: form });
}

export function registerLicenseHolder(payload: LicensePayload, files: LicenseFiles): Promise<{ id: number }> {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  if (files.license) form.append("license_file", files.license);
  if (files.mining) form.append("mining_license_file", files.mining);
  if (files.sro) form.append("sro_design_file", files.sro);
  if (files.lab) form.append("lab_accreditation_file", files.lab);
  return apiJson("/register/license-holder", { method: "POST", body: form });
}

export function confirmEmail(email: string, code: string, role: Role): Promise<unknown> {
  return apiJson("/register/confirm-email", {
    method: "POST",
    body: JSON.stringify({ email, code, role }),
  });
}

export function resendCode(email: string, role: Role): Promise<unknown> {
  return apiJson("/register/resend-code", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}
