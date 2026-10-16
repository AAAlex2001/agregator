/** Редактируемая научная квалификация исследователя для регистрации и кабинета. */
export interface ResearchProfileValues {
  academic_degree: string;
  science_branches: string[];
  academic_title: string;
  research_field: string;
}

/** Анкета из API совпадает с редактируемыми полями: документов в этом направлении нет. */
export type ResearchProfile = ResearchProfileValues;

/** Элемент научного справочника: код сохраняется, название отображается пользователю. */
export interface ResearchOption {
  code: string;
  title: string;
}

/** Справочники степеней, отраслей науки и званий для заполнения анкеты. */
export interface ResearchOptions {
  academic_degrees: ResearchOption[];
  science_branches: ResearchOption[];
  academic_titles: ResearchOption[];
}
