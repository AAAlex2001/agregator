import { sroHolderToApi } from "@/source/entities/directions/shared";
import type { PartySuggestion } from "@/source/entities/party";
import { readReferralCode } from "@/source/entities/referral";
import { registerLicenseHolder, registerUser, type AccountPayload } from "@/source/entities/user";
import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import { toExpertDocuments } from "./directionFiles";
import type { RegisterState } from "./types";

const DIRECTION_REQUIRED = "Выберите хотя бы одно направление";
const COMPANY_REQUIRED = "Выберите организацию из подсказок по ИНН";

function hasDirection(state: RegisterState): boolean {
  if (state.role === "CUSTOMER") return state.directions.length > 0 || state.auditCustomerProfile !== null;
  if (state.role === "EXPERT") {
    return [
      state.expertiseProfile,
      state.auditExpertProfile,
      state.cadastralProfile,
      state.forensicProfile,
      state.researchProfile,
      state.laboratoryProfile,
      state.techDiagProfile,
      state.designProfile,
      state.ecologyProfile,
      state.surveyProfile,
    ].some((profile) => profile !== null);
  }
  return (
    state.licenseEnabled ||
    state.directions.length > 0 ||
    state.auditHolderProfile !== null ||
    state.techDiagHolderProfile !== null ||
    state.designHolderProfile !== null ||
    state.surveyHolderProfile !== null
  );
}

/** Текст ошибки, из-за которой форму нельзя отправлять, или null. */
export function validateRegister(state: RegisterState): string | null {
  if (!hasDirection(state)) return DIRECTION_REQUIRED;
  if (state.role !== "EXPERT" && !state.party) return COMPANY_REQUIRED;
  return null;
}

function accountPayload(state: RegisterState): AccountPayload {
  return {
    email: state.email.trim(),
    password: state.password,
    password_confirm: state.confirm,
    phone: toRussianPhoneApiValue(state.phone) || undefined,
    privacy_consent: state.consents.privacy,
    terms_consent: state.consents.terms,
    personal_data_consent: state.consents.personal,
  };
}

function registerCustomer(state: RegisterState, party: PartySuggestion) {
  return registerUser(
    {
      ...accountPayload(state),
      role: "CUSTOMER",
      first_name: state.firstName.trim() || undefined,
      last_name: state.lastName.trim() || undefined,
      inn: party.data.inn ?? "",
      company_data: party,
      audit_customer_profile: state.auditCustomerProfile,
      directions: state.directions,
    },
    [],
  );
}

function registerExpert(state: RegisterState) {
  return registerUser(
    {
      ...accountPayload(state),
      role: "EXPERT",
      referral_code: readReferralCode(),
      first_name: state.firstName.trim() || undefined,
      last_name: state.lastName.trim() || undefined,
      location_lat: state.location?.lat ?? null,
      location_lng: state.location?.lng ?? null,
      location_address: state.location?.address || null,
      location_city: state.location?.city ?? null,
      travels_to_other_regions: state.travels,
      show_on_map: state.showOnMap,
      map_fields: state.mapFields,
      expertise_profile: state.expertiseProfile,
      audit_expert_profile: state.auditExpertProfile,
      cadastral_profile: state.cadastralProfile,
      forensic_profile: state.forensicProfile,
      research_profile: state.researchProfile,
      laboratory_profile: state.laboratoryProfile,
      tech_diag_profile: state.techDiagProfile,
      design_profile: state.designProfile,
      ecology_profile: state.ecologyProfile,
      survey_profile: state.surveyProfile,
      contact_sales_enabled: state.contactEnabled,
      contact_price_rubles: state.contactEnabled ? Number(state.contactPrice.replace(/\s/g, "")) : undefined,
      contact_payment_details: state.contactEnabled ? state.contactDetails.trim() : undefined,
      contact_disclosure_consent: state.contactConsent,
    },
    toExpertDocuments(state.directionFiles),
  );
}

function registerHolder(state: RegisterState, party: PartySuggestion) {
  const license = state.licenseEnabled;
  return registerLicenseHolder(
    {
      ...accountPayload(state),
      inn: party.data.inn ?? "",
      company_data: party,
      license_number: license ? state.licenseNumber.trim() : "",
      license_areas: license ? state.licenseAreas : [],
      license_rental_kind: license ? state.rentalKind : null,
      license_rental_percent:
        license && state.rentalKind === "PERCENT" ? Number(state.rentalPercent.replace(",", ".")) : undefined,
      license_rental_fixed_amount:
        license && state.rentalKind === "FIXED" ? Number(state.rentalFixed.replace(/\s/g, "")) : undefined,
      mining_license_number: state.miningNumber.trim() || null,
      lab_accreditation_number: state.labNumber.trim() || null,
      audit_profile: state.auditHolderProfile,
      tech_diag_profile: state.techDiagHolderProfile,
      design_profile: state.designHolderProfile ? sroHolderToApi(state.designHolderProfile) : null,
      survey_profile: state.surveyHolderProfile ? sroHolderToApi(state.surveyHolderProfile) : null,
      directions: state.directions,
    },
    state.files,
  );
}

/** Отправить регистрацию под выбранную роль. Организация к этому моменту уже проверена validateRegister. */
export async function submitRegister(state: RegisterState): Promise<void> {
  if (state.role === "EXPERT") {
    await registerExpert(state);
    return;
  }
  if (!state.party) throw new Error(COMPANY_REQUIRED);
  await (state.role === "CUSTOMER" ? registerCustomer(state, state.party) : registerHolder(state, state.party));
}
