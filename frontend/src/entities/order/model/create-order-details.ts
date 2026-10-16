import type { OrderApplicant } from "./details/applicant";
import type { AuditOrderObject } from "./details/audit";
import type { OrderListItem } from "./order-list-item";

/** Создаёт незаполненный производственный объект для заявки на аудит. */
export function createAuditOrderObject(): AuditOrderObject {
  return {
    registration_number: "",
    name: "",
    hazard_class: "",
    address: "",
    industry: "",
    hazard_signs: "",
  };
}

/** Создаёт условия выбранного направления со сведениями о заявителе. */
export function createOrderDetails(
  workType: OrderListItem["work_type"],
  applicant: OrderApplicant,
): OrderListItem["details"] {
  switch (workType) {
    case "AUDIT_SUPB":
      return {
        ...applicant,
        audit_scale: "SINGLE_OPO",
        opo_items: [createAuditOrderObject()],
        opo_total: null,
        opo_class_1: null,
        opo_class_2: null,
        opo_class_3: null,
        opo_class_4: null,
        main_industry: "",
        multiple_regions: null,
        registration_certificate: null,
        audit_kind: "BASIC",
        considers_sto: null,
        sto_name: "",
        sto_file: null,
        audit_areas: [],
        desired_timeline: "CURRENT_QUARTER",
        comments: "",
      };
    case "CADASTRAL":
      return {
        ...applicant,
        work_purpose: "",
        city: "",
        education_requirement: "",
        sro_required: false,
        duration: "",
      };
    case "DESIGN":
      return {
        ...applicant,
        object_name: "",
        construction_city: "",
        doc_categories: [],
        documentation_kinds: [],
        scope: "FULL",
        sections: [],
        approvals: [],
        approvals_other: "",
      };
    case "ECOLOGY":
      return {
        ...applicant,
        work_types: [],
      };
    case "FORENSIC":
      return {
        ...applicant,
        expertise_purpose: "",
        government_body: "",
        city: "",
        education_requirement: "",
        extra_requirements: "",
        similar_experience_required: false,
        duration: "",
      };
    case "LABORATORY":
      return {
        ...applicant,
        equipment_requirements: "",
      };
    case "RESEARCH":
      return {
        ...applicant,
        executor_requirements: [""],
        needs_site_visit: false,
      };
    case "SURVEY":
      return {
        ...applicant,
        kinds: [],
      };
    case "TECH_DIAG":
      return {
        ...applicant,
        purpose: "",
        object_city: "",
        duration: "",
      };
    default:
      return null;
  }
}
