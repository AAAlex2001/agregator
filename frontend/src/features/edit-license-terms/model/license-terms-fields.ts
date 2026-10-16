import { EXPERTISE_TYPES } from "@/entities/expertise";
import type { UserProfile } from "@/entities/user";
import type { LicenseTermsFields } from "./types";

/** Заполняет форму сохранёнными условиями лицензии текущего аккаунта. */
export function createLicenseTermsFields(profile: UserProfile): LicenseTermsFields {
  const holder = profile.license_holder;

  return {
    licenseNumber: holder?.license_number ?? "",
    licenseAreas: EXPERTISE_TYPES.filter((type) => holder?.license_areas?.includes(type)),
    rentalKind: holder?.license_rental_kind ?? "PERCENT",
    rentalPercent: holder?.license_rental_kind === "PERCENT"
      ? String(holder.license_rental_percent ?? "")
      : "",
    rentalFixedAmount: holder?.license_rental_kind === "FIXED"
      ? String(holder.license_rental_fixed_amount ?? "")
      : "",
    miningLicenseNumber: holder?.mining_license_number ?? "",
    labAccreditationNumber: holder?.lab_accreditation_number ?? "",
  };
}
