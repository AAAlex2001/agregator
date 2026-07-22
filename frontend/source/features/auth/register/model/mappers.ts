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
    location_lat: role === "EXPERT" ? values.locationLat : undefined,
    location_lng: role === "EXPERT" ? values.locationLng : undefined,
    location_address: role === "EXPERT" ? (values.locationAddress || null) : undefined,
    location_city: role === "EXPERT" ? values.locationCity : undefined,
    travels_to_other_regions: role === "EXPERT" ? values.travelsToOtherRegions : undefined,
    expert_certificates:
      role === "EXPERT" && values.expertConfirmed ? values.expertCertificates : undefined,
    expert_show_on_map:
      role === "EXPERT" && values.expertConfirmed ? values.showOnMap : undefined,
    expert_map_fields:
      role === "EXPERT" && values.expertConfirmed ? values.mapFields : undefined,
    contact_sales_enabled: role === "EXPERT" ? values.contactSalesEnabled : undefined,
    contact_price_rubles:
      role === "EXPERT" && values.contactSalesEnabled
        ? Number(values.contactPriceRubles.replace(/\s/g, ""))
        : undefined,
    contact_payment_details:
      role === "EXPERT" && values.contactSalesEnabled
        ? values.contactPaymentDetails.trim()
        : undefined,
    contact_disclosure_consent:
      role === "EXPERT" ? values.contactDisclosureConsent : undefined,
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
    lab_accreditation_number: values.labAccreditationNumber?.trim() || null,
  };
}
