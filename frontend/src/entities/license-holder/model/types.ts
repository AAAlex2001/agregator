/** Способ расчёта стоимости предоставления лицензии, сохраняемый в API. */
export type LicenseRentalKind = "PERCENT" | "FIXED" | "NEGOTIABLE";

/** Сохранённое название компании в ответе каталога держателей документов. */
export interface LicenseHolderCompanyData {
  value?: string;
  unrestricted_value?: string;
  data?: {
    name?: {
      short_with_opf?: string | null;
    } | null;
  };
}

/** Компания, её контакты и разрешительные документы из /license-holders/. */
export interface LicenseHolderListItem {
  id: number;
  inn: string | null;
  company_data: LicenseHolderCompanyData | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  license_file_url: string | null;
  license_areas: string[] | null;
  license_rental_kind: LicenseRentalKind | null;
  license_rental_percent: number | null;
  license_rental_fixed_amount: number | null;
  mining_license_number: string | null;
  mining_license_file_url: string | null;
  sro_design_file_url: string | null;
  sro_survey_file_url: string | null;
  lab_accreditation_number: string | null;
  lab_accreditation_file_url: string | null;
  company_card_url: string | null;
}

/** Страница каталога и общее число доступных компаний. */
export interface LicenseHolderListResponse {
  items: LicenseHolderListItem[];
  total: number;
}
