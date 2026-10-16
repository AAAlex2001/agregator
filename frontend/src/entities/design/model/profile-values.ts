import type { DesignProfile, DesignProfileValues } from "./types";

/** Создаёт пустую анкету проектировщика для регистрации. */
export function createDesignProfileValues(): DesignProfileValues {
  return {
    education: "",
    specialties: [],
    nok_passed: false,
    nrs_number: "",
    sro_gip_declared: false,
    qualification_courses: "",
    rtn_areas: [],
  };
}

/** Выбирает редактируемые поля анкеты; документы сохраняются отдельно. */
export function getDesignProfileValues(profile: DesignProfile): DesignProfileValues {
  return {
    education: profile.education,
    specialties: profile.specialties,
    nok_passed: profile.nok_passed,
    nrs_number: profile.nrs_number,
    sro_gip_declared: profile.sro_gip_declared,
    qualification_courses: profile.qualification_courses,
    rtn_areas: profile.rtn_areas,
  };
}
