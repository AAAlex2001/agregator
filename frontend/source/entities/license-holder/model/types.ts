import type { CompanyData, LicenseRentalKind } from "@/source/entities/user";

export interface LicenseHolderListItem {
  id: number;
  inn: string | null;
  company_data: CompanyData | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  license_file_url: string | null;
  license_areas: string[] | null;
  license_rental_kind: LicenseRentalKind | null;
  license_rental_percent: number | null;
  license_rental_fixed_amount: number | null;
  company_card_url: string | null;
}

export interface LicenseHolderListResponse {
  items: LicenseHolderListItem[];
  total: number;
}
