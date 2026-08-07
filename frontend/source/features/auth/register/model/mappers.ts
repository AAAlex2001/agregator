import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { CompanyData, LicenseHolderRegisterPayload } from "@/source/entities/user";
import type { RegisterPayload } from "./api";
import type { RegisterFormValues } from "./schema";

export function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
  const role = values.role;
  const isExpert = role === "EXPERT";
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
    location_lat: isExpert ? values.locationLat : undefined,
    location_lng: isExpert ? values.locationLng : undefined,
    location_address: isExpert ? (values.locationAddress || null) : undefined,
    location_city: isExpert ? values.locationCity : undefined,
    travels_to_other_regions: isExpert ? values.travelsToOtherRegions : undefined,
    show_on_map: isExpert ? values.showOnMap : undefined,
    map_fields: isExpert ? values.mapFields : undefined,
    expertise_profile: isExpert ? values.expertiseProfile : null,
    audit_expert_profile: isExpert ? values.auditExpertProfile : null,
    audit_customer_profile: role === "CUSTOMER" ? values.auditCustomerProfile : null,
    cadastral_profile: isExpert ? values.cadastralProfile : null,
    forensic_profile: isExpert ? values.forensicProfile : null,
    research_profile: isExpert ? values.researchProfile : null,
    laboratory_profile: isExpert ? values.laboratoryProfile : null,
    contact_sales_enabled: isExpert ? values.contactSalesEnabled : undefined,
    contact_price_rubles:
      isExpert && values.contactSalesEnabled
        ? Number(values.contactPriceRubles.replace(/\s/g, ""))
        : undefined,
    contact_payment_details:
      isExpert && values.contactSalesEnabled
        ? values.contactPaymentDetails.trim()
        : undefined,
    contact_disclosure_consent: isExpert ? values.contactDisclosureConsent : undefined,
  };
}

export function toLicenseHolderPayload(values: RegisterFormValues): LicenseHolderRegisterPayload {
  const hasLicense = values.licenseEnabled;
  return {
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone),
    inn: values.companyData?.data?.inn ?? "",
    company_data: values.companyData as CompanyData,
    license_number: hasLicense ? values.licenseNumber.trim() : "",
    license_areas: hasLicense ? values.licenseAreas : [],
    license_rental_kind: hasLicense ? values.rentalKind : null,
    audit_profile: values.auditLicenseHolderProfile,
    license_rental_percent:
      hasLicense && values.rentalKind === "PERCENT"
        ? Number(values.rentalPercent.replace(",", "."))
        : undefined,
    license_rental_fixed_amount:
      hasLicense && values.rentalKind === "FIXED"
        ? Number(values.rentalFixedAmount.replace(/\s/g, ""))
        : undefined,
    mining_license_number: values.miningLicenseNumber?.trim() || null,
    lab_accreditation_number: values.labAccreditationNumber?.trim() || null,
  };
}
