import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { CompanyData, LicenseHolderRegisterPayload } from "@/source/entities/user";
import type { RegisterPayload } from "./api";
import type { RegisterFormValues } from "./schema";

function basePayload(values: RegisterFormValues): RegisterPayload {
  return {
    role: values.role,
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone) || undefined,
    first_name: values.firstName || undefined,
    last_name: values.lastName || undefined,
  };
}

function customerPayload(values: RegisterFormValues): RegisterPayload {
  return {
    ...basePayload(values),
    inn: values.companyData?.data?.inn ?? "",
    company_data: values.companyData as CompanyData | null,
    audit_customer_profile: values.auditCustomerProfile,
  };
}

function expertPayload(values: RegisterFormValues): RegisterPayload {
  return {
    ...basePayload(values),
    location_lat: values.locationLat,
    location_lng: values.locationLng,
    location_address: values.locationAddress || null,
    location_city: values.locationCity,
    travels_to_other_regions: values.travelsToOtherRegions,
    show_on_map: values.showOnMap,
    map_fields: values.mapFields,
    expertise_profile: values.expertiseProfile,
    audit_expert_profile: values.auditExpertProfile,
    cadastral_profile: values.cadastralProfile,
    forensic_profile: values.forensicProfile,
    research_profile: values.researchProfile,
    laboratory_profile: values.laboratoryProfile,
    contact_sales_enabled: values.contactSalesEnabled,
    contact_price_rubles: values.contactSalesEnabled
      ? Number(values.contactPriceRubles.replace(/\s/g, ""))
      : undefined,
    contact_payment_details: values.contactSalesEnabled
      ? values.contactPaymentDetails.trim()
      : undefined,
    contact_disclosure_consent: values.contactDisclosureConsent,
  };
}

export function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
  return values.role === "EXPERT" ? expertPayload(values) : customerPayload(values);
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
    audit_profile: values.auditLicenseHolderProfile,
  };
}
