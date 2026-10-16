import type { ForensicProfile, ForensicProfileValues } from "./types";

/** Создаёт поля судебного эксперта для новой регистрации. */
export function createForensicProfileValues(): ForensicProfileValues {
  return {
    education: "",
    extra_education: "",
    has_similar_experience: false,
    has_degree: false,
    degree: "",
    city: "",
    workplace_kind: "INDIVIDUAL",
    workplace_name: "",
  };
}

/** Отделяет сведения судебного эксперта от сохранённых документов. */
export function getForensicProfileValues(
  profile: ForensicProfile,
): ForensicProfileValues {
  return {
    education: profile.education,
    extra_education: profile.extra_education,
    has_similar_experience: profile.has_similar_experience,
    has_degree: profile.has_degree,
    degree: profile.degree,
    city: profile.city,
    workplace_kind: profile.workplace_kind,
    workplace_name: profile.workplace_name,
  };
}
