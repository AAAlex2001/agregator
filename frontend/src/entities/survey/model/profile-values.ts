import type { SurveyProfile, SurveyProfileValues } from "./types";

/** Создаёт отдельную пустую анкету для новой регистрации. */
export function createSurveyProfileValues(): SurveyProfileValues {
  return {
    education: "",
    kinds: [],
    kinds_other: "",
    nok_passed: false,
    nrs_number: "",
    sro_gip_declared: false,
    qualification_courses: "",
    rtn_areas: [],
  };
}

/** Отделяет редактируемые сведения изыскателя от сохранённых документов. */
export function getSurveyProfileValues(
  profile: SurveyProfile,
): SurveyProfileValues {
  return {
    education: profile.education,
    kinds: profile.kinds,
    kinds_other: profile.kinds_other,
    nok_passed: profile.nok_passed,
    nrs_number: profile.nrs_number,
    sro_gip_declared: profile.sro_gip_declared,
    qualification_courses: profile.qualification_courses,
    rtn_areas: profile.rtn_areas,
  };
}
