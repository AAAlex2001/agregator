import type { AuditExpertProfileValues } from "@/entities/audit";
import type { CadastralProfileValues } from "@/entities/cadastral";
import type { DesignProfileValues } from "@/entities/design";
import type { EcologyProfileValues } from "@/entities/ecology";
import type { ExpertiseProfileValues } from "@/entities/expertise";
import type { ForensicProfileValues } from "@/entities/forensic";
import type { LaboratoryProfileValues } from "@/entities/laboratory";
import type { ResearchProfileValues } from "@/entities/research";
import type { SurveyProfileValues } from "@/entities/survey";
import type { TechDiagProfileValues } from "@/entities/tech-diag";
import { registerAccount } from "@/entities/user";
import type { RegistrationAccount } from "./account";
import { getAccountRequestFields } from "./account-request";
import type { RegistrationAccountRequest } from "./account-request";
import type { ExpertRegistration } from "./expert";
import { getExpertDocuments } from "./expert-documents";

/** Payload исполнителя: анкеты, настройки карты и платного доступа в именах API. */
interface ExpertRegistrationRequest extends RegistrationAccountRequest {
  role: "EXPERT";
  referral_code?: string;
  first_name?: string;
  last_name?: string;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  location_city: string | null;
  travels_to_other_regions: boolean;
  show_on_map: boolean;
  map_fields: string[];
  expertise_profile: ExpertiseProfileValues | null;
  audit_expert_profile: AuditExpertProfileValues | null;
  cadastral_profile: CadastralProfileValues | null;
  forensic_profile: ForensicProfileValues | null;
  research_profile: ResearchProfileValues | null;
  laboratory_profile: LaboratoryProfileValues | null;
  tech_diag_profile: TechDiagProfileValues | null;
  design_profile: DesignProfileValues | null;
  ecology_profile: EcologyProfileValues | null;
  survey_profile: SurveyProfileValues | null;
  contact_sales_enabled: boolean;
  contact_price_rubles?: number;
  contact_payment_details?: string;
  contact_disclosure_consent: boolean;
}

/** Отправляет анкеты исполнителя и пары «документ — назначение» одним запросом. */
export async function submitExpert(
  account: RegistrationAccount,
  expert: ExpertRegistration,
  referralCode: string | undefined,
): Promise<void> {
  const contact = expert.contactOffer;
  const location = expert.location;
  const payload: ExpertRegistrationRequest = {
    ...getAccountRequestFields(account),
    role: "EXPERT",
    referral_code: referralCode,
    first_name: account.firstName.trim() || undefined,
    last_name: account.lastName.trim() || undefined,
    location_lat: location.point?.lat ?? null,
    location_lng: location.point?.lng ?? null,
    location_address: location.point?.address || null,
    location_city: location.point?.city ?? null,
    travels_to_other_regions: location.travels,
    show_on_map: location.showOnMap,
    map_fields: location.mapFields,
    expertise_profile: expert.expertise,
    audit_expert_profile: expert.audit.profile,
    cadastral_profile: expert.cadastral.profile,
    forensic_profile: expert.forensic.profile,
    research_profile: expert.research,
    laboratory_profile: expert.laboratory,
    tech_diag_profile: expert.techDiag.profile,
    design_profile: expert.design.profile,
    ecology_profile: expert.ecology.profile,
    survey_profile: expert.survey.profile,
    contact_sales_enabled: contact.enabled,
    contact_price_rubles: contact.enabled ? Number(contact.price.replace(/\s/g, "")) : undefined,
    contact_payment_details: contact.enabled ? contact.paymentDetails.trim() : undefined,
    contact_disclosure_consent: contact.consent,
  };
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));

  for (const document of getExpertDocuments(expert)) {
    form.append("documents", document.selected.file);
    form.append("document_directions", document.direction);
  }

  await registerAccount(form);
}

