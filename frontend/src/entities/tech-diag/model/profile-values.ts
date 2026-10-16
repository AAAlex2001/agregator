import type {
  TechDiagHolderProfile,
  TechDiagProfile,
  TechDiagProfileValues,
} from "./types";

/** Создаёт пустую анкету специалиста неразрушающего контроля. */
export function createTechDiagProfileValues(): TechDiagProfileValues {
  return {
    qualification_certificates: "",
    methods: [],
    control_objects: [],
  };
}

/** Создаёт пустую анкету лаборатории неразрушающего контроля. */
export function createTechDiagHolderProfile(): TechDiagHolderProfile {
  return {
    methods: [],
    organization_city: "",
  };
}

/** Отделяет редактируемые сведения специалиста НК от его документов. */
export function getTechDiagProfileValues(
  profile: TechDiagProfile,
): TechDiagProfileValues {
  return {
    qualification_certificates: profile.qualification_certificates,
    methods: profile.methods,
    control_objects: profile.control_objects,
  };
}
