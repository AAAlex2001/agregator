import type {
  SroProfile,
  SroProfilePayload,
  SroProfileResponse,
  SroProfileValues,
} from "./types";

/** Создаёт незаполненную анкету члена СРО для регистрации. */
export function createSroProfileValues(): SroProfileValues {
  return {
    sro_name: "",
    sro_registry_number: "",
    hazardous_objects_right: false,
    nuclear_objects_right: false,
    liability_level: "1",
    pricing_kind: "PERCENT",
    pricing_percent: "",
    pricing_fixed_amount: "",
  };
}

/** Отделяет редактируемые поля члена СРО от загруженных документов. */
export function getSroProfileValues(profile: SroProfile): SroProfileValues {
  return {
    sro_name: profile.sro_name,
    sro_registry_number: profile.sro_registry_number,
    hazardous_objects_right: profile.hazardous_objects_right,
    nuclear_objects_right: profile.nuclear_objects_right,
    liability_level: profile.liability_level,
    pricing_kind: profile.pricing_kind,
    pricing_percent: profile.pricing_percent,
    pricing_fixed_amount: profile.pricing_fixed_amount,
  };
}

/** Преобразует строки полей в числовые значения API. */
export function toSroProfilePayload(values: SroProfileValues): SroProfilePayload {
  return {
    sro_name: values.sro_name,
    sro_registry_number: values.sro_registry_number,
    hazardous_objects_right: values.hazardous_objects_right,
    nuclear_objects_right: values.nuclear_objects_right,
    liability_level: Number(values.liability_level) || 1,
    pricing_kind: values.pricing_kind,
    pricing_percent:
      values.pricing_kind === "PERCENT" && values.pricing_percent
        ? Number(values.pricing_percent.replace(",", "."))
        : null,
    pricing_fixed_amount:
      values.pricing_kind === "FIXED" && values.pricing_fixed_amount
        ? Number(values.pricing_fixed_amount.replace(/\s/g, ""))
        : null,
  };
}

/** Подготавливает числовые значения анкеты для полей ввода. */
export function fromSroProfileResponse(profile: SroProfileResponse): SroProfile {
  return {
    ...profile,
    liability_level: String(profile.liability_level || 1),
    pricing_percent:
      profile.pricing_percent === null ? "" : String(profile.pricing_percent),
    pricing_fixed_amount:
      profile.pricing_fixed_amount === null ? "" : String(profile.pricing_fixed_amount),
  };
}
