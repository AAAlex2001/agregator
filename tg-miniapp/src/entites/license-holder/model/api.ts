import { apiJson } from "@/shared/services/api";

export interface LicenseHolder {
  id: number;
  inn: string | null;
  company_data: {
    value?: string;
    unrestricted_value?: string;
    data?: { name?: { short_with_opf?: string } };
  } | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  license_file_url: string | null;
  license_areas: string[] | null;
  license_rental_kind: string | null;
  license_rental_percent: number | null;
  license_rental_fixed_amount: number | null;
  mining_license_number: string | null;
  mining_license_file_url: string | null;
  sro_design_file_url: string | null;
  lab_accreditation_number: string | null;
  lab_accreditation_file_url: string | null;
  company_card_url: string | null;
}

export interface LicenseHolderList {
  items: LicenseHolder[];
  total: number;
}

export const listLicenseHolders = (limit = 50) =>
  apiJson<LicenseHolderList>(`/license-holders/?skip=0&limit=${limit}`);

export function licenseHolderName(holder: LicenseHolder): string {
  return (
    holder.company_data?.value ??
    holder.company_data?.unrestricted_value ??
    holder.company_data?.data?.name?.short_with_opf ??
    "Лицензиат"
  );
}

export function formatRental(holder: LicenseHolder): string {
  if (holder.license_rental_kind === "PERCENT" && holder.license_rental_percent !== null) {
    return `${holder.license_rental_percent}% от суммы`;
  }
  if (holder.license_rental_kind === "FIXED" && holder.license_rental_fixed_amount !== null) {
    return `от ${holder.license_rental_fixed_amount.toLocaleString("ru-RU")} ₽`;
  }
  if (holder.license_rental_kind === "NEGOTIABLE") {
    return "Договорная";
  }
  return "—";
}
