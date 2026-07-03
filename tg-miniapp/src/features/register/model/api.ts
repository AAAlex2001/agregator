import { apiJson, type Role } from "@/shared/services/api";
import type { Party } from "@/entites/party";

export type RentalKind = "PERCENT" | "FIXED" | "NEGOTIABLE";

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
}

export function registerUser(payload: RegisterPayload): Promise<{ id: number }> {
  return apiJson("/register/", { method: "POST", body: JSON.stringify(payload) });
}

export function registerLicenseHolder(payload: LicensePayload, file: File | null): Promise<{ id: number }> {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  if (file) form.append("license_file", file);
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
