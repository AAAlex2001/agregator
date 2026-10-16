import type { CadastralProfile, CadastralProfileValues } from "./types";

/** Создаёт поля кадастрового инженера для новой регистрации. */
export function createCadastralProfileValues(): CadastralProfileValues {
  return {
    education: "",
    registry_joined_at: null,
    certificate_number: "",
    registry_number: "",
    has_equipment: false,
    city: "",
    workplace: "",
  };
}

/** Отделяет редактируемые сведения инженера от загруженных документов. */
export function getCadastralProfileValues(
  profile: CadastralProfile,
): CadastralProfileValues {
  return {
    education: profile.education,
    registry_joined_at: profile.registry_joined_at,
    certificate_number: profile.certificate_number,
    registry_number: profile.registry_number,
    has_equipment: profile.has_equipment,
    city: profile.city,
    workplace: profile.workplace,
  };
}
