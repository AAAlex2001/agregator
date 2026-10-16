/** Вариант справочника аудита: код API и подпись в списке выбора. */
export interface AuditOption {
  value: string;
  label: string;
}

/** Доступные области и квалификации для анкет участников аудита СУПБ. */
export interface AuditOptions {
  industrialSafetyAreas: AuditOption[];
  expertAttestationAreas: AuditOption[];
  auditQualifications: AuditOption[];
  accreditationAreas: AuditOption[];
  auditAreas: AuditOption[];
}

/** Документ аудитора, уже загруженный на сервер. */
export interface AuditDocument {
  name: string;
  url: string;
}

/** Выбранные коды справочников в редактируемой анкете аудитора. */
export interface AuditExpertProfileValues {
  industrial_safety_areas: string[];
  expert_attestation_areas: string[];
  audit_qualifications: string[];
}

/** Сохранённая анкета аудитора вместе с подтверждающими документами. */
export interface AuditExpertProfile extends AuditExpertProfileValues {
  documents: AuditDocument[];
}

/** Должность заказчика аудита и номер лицензии его опасного объекта. */
export interface AuditCustomerProfileValues {
  position: string;
  opo_license_number: string;
}

/** Аккредитация инспекционного органа; области содержат коды API. */
export interface AuditHolderProfileValues {
  certificate_number: string;
  accreditation_areas: string[];
}

