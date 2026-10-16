import type { ExpertiseType } from "@/entities/expertise";
import type { LicenseRentalKind } from "@/entities/license-holder";

/** Номер лицензии, разрешённые объекты и условия её предоставления. */
export interface LicenseTermsFields {
  licenseNumber: string;
  licenseAreas: ExpertiseType[];
  rentalKind: LicenseRentalKind;
  rentalPercent: string;
  rentalFixedAmount: string;
  miningLicenseNumber: string;
  labAccreditationNumber: string;
}
