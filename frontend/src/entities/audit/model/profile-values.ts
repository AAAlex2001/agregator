import type {
  AuditCustomerProfileValues,
  AuditExpertProfile,
  AuditExpertProfileValues,
  AuditHolderProfileValues,
} from "./types";

/** Создаёт анкету представителя заказчика аудита. */
export function createAuditCustomerProfileValues(): AuditCustomerProfileValues {
  return {
    position: "",
    opo_license_number: "",
  };
}

/** Создаёт анкету аккредитованного инспекционного органа. */
export function createAuditHolderProfileValues(): AuditHolderProfileValues {
  return {
    certificate_number: "",
    accreditation_areas: [],
  };
}

/** Создаёт отдельную незаполненную анкету аудитора. */
export function createAuditExpertProfileValues(): AuditExpertProfileValues {
  return {
    industrial_safety_areas: [],
    expert_attestation_areas: [],
    audit_qualifications: [],
  };
}

/** Выделяет выбранные области и квалификации аудитора для редактирования. */
export function getAuditExpertProfileValues(
  profile: AuditExpertProfile,
): AuditExpertProfileValues {
  return {
    industrial_safety_areas: profile.industrial_safety_areas,
    expert_attestation_areas: profile.expert_attestation_areas,
    audit_qualifications: profile.audit_qualifications,
  };
}
