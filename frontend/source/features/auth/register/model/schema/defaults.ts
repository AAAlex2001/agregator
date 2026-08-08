import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import {
  emptyAuditCustomerProfile,
  emptyAuditExpertProfile,
  emptyAuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import type { RegisterFormValues } from "./fields";

export const emptyRegisterFormValues: RegisterFormValues = {
  role: "CUSTOMER",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  password: "",
  repeatPassword: "",
  agreePrivacy: false,
  agreeTerms: false,
  agreeConsent: false,
  companyName: "",
  companyData: null,
  expertiseProfile: null,
  auditExpertProfile: null,
  auditCustomerProfile: null,
  auditLicenseHolderProfile: null,
  cadastralProfile: null,
  forensicProfile: null,
  researchProfile: null,
  laboratoryProfile: null,
  licenseEnabled: true,
  licenseNumber: "",
  licenseAreas: [],
  licenseFileName: "",
  rentalKind: "PERCENT",
  rentalPercent: "",
  rentalFixedAmount: "",
  miningLicenseNumber: "",
  labAccreditationNumber: "",
  locationLat: null,
  locationLng: null,
  locationAddress: "",
  locationCity: null,
  travelsToOtherRegions: false,
  showOnMap: true,
  mapFields: ["name", "area", "object", "category"],
  contactSalesEnabled: false,
  contactPriceRubles: "",
  contactPaymentDetails: "",
  contactDisclosureConsent: false,
};

export function presetRegisterFormValues(preset: AuthPreset): RegisterFormValues {
  const values: RegisterFormValues = { ...emptyRegisterFormValues, role: preset.role };
  if (preset.direction !== "AUDIT_SUPB") return values;

  if (preset.role === "CUSTOMER") {
    values.auditCustomerProfile = { ...emptyAuditCustomerProfile };
  }
  if (preset.role === "EXPERT") {
    values.auditExpertProfile = { ...emptyAuditExpertProfile };
  }
  if (preset.role === "LICENSE_HOLDER") {
    values.auditLicenseHolderProfile = { ...emptyAuditLicenseHolderProfile };
    values.licenseEnabled = false;
  }
  return values;
}
