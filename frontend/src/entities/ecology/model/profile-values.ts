import type { EcologyProfile, EcologyProfileValues } from "./types";

/** Создаёт пустые поля эколога для новой регистрации. */
export function createEcologyProfileValues(): EcologyProfileValues {
  return {
    work_types: [],
    practical_skills: "",
  };
}

/** Создаёт независимый черновик полей без сохранённых документов. */
export function getEcologyProfileValues(
  profile: EcologyProfile,
): EcologyProfileValues {
  return {
    work_types: [...profile.work_types],
    practical_skills: profile.practical_skills,
  };
}
