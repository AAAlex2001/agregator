import type { ResearchProfile, ResearchProfileValues } from "./types";

/** Создаёт независимую пустую анкету исследователя. */
export function createResearchProfileValues(): ResearchProfileValues {
  return {
    academic_degree: "",
    science_branches: [],
    academic_title: "",
    research_field: "",
  };
}

/** Создаёт независимый черновик научной квалификации из сохранённой анкеты. */
export function getResearchProfileValues(
  profile: ResearchProfile,
): ResearchProfileValues {
  return {
    academic_degree: profile.academic_degree,
    science_branches: [...profile.science_branches],
    academic_title: profile.academic_title,
    research_field: profile.research_field,
  };
}

/** Убирает отрасли науки, когда пользователь выбирает отсутствие учёной степени. */
export function changeAcademicDegree(
  profile: ResearchProfileValues,
  degree: string,
): ResearchProfileValues {
  return {
    ...profile,
    academic_degree: degree,
    science_branches: degree ? profile.science_branches : [],
  };
}
