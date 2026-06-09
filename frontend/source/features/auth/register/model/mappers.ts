import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type {
  CompanyData,
  LicenseHolderRegisterPayload,
  RegisterApiPayload,
} from "@/source/entities/user";
import type { RegisterFormValues } from "./schema";

export function toRegisterPayload(values: RegisterFormValues): RegisterApiPayload {
  const role = values.role;
  return {
    role,
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone) || undefined,
    first_name: values.firstName || undefined,
    last_name: values.lastName || undefined,
    inn: role === "CUSTOMER" ? (values.companyData?.data?.inn ?? "") : undefined,
    company_data: role === "CUSTOMER"
      ? (values.companyData as CompanyData | null)
      : null,
  };
}

export function toLicenseHolderPayload(values: RegisterFormValues): LicenseHolderRegisterPayload {
  return {
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone),
    inn: values.companyData?.data?.inn ?? "",
    company_data: values.companyData as CompanyData,
    license_number: values.licenseNumber.trim(),
    license_areas: values.licenseAreas,
    license_rental_kind: values.rentalKind,
    license_rental_percent:
      values.rentalKind === "PERCENT" ? Number(values.rentalPercent.replace(",", ".")) : undefined,
    license_rental_fixed_amount:
      values.rentalKind === "FIXED" ? Number(values.rentalFixedAmount.replace(/\s/g, "")) : undefined,
    mining_license_number: values.miningLicenseNumber?.trim() || null,
    sro_design_number: values.sroDesignNumber?.trim() || null,
    lab_accreditation_number: values.labAccreditationNumber?.trim() || null,
  };
}
