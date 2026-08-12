export interface MapFilterOption {
  value: string;
  title: string;
  short?: string;
}

export interface MapFilterGroup {
  label: string;
  options: MapFilterOption[];
}

export const CADASTRAL_FILTER_GROUPS: MapFilterGroup[] = [
  {
    label: "Оснащение",
    options: [{ value: "EQUIPMENT", title: "Есть необходимое оборудование" }],
  },
];

export const FORENSIC_FILTER_GROUPS: MapFilterGroup[] = [
  {
    label: "Квалификация",
    options: [
      { value: "DEGREE", title: "С учёной степенью" },
      { value: "EXPERIENCE", title: "С опытом аналогичных экспертиз" },
    ],
  },
  {
    label: "Место работы",
    options: [
      { value: "WORKPLACE_ORGANIZATION", title: "Экспертная организация" },
      { value: "WORKPLACE_INDIVIDUAL", title: "Частный эксперт" },
    ],
  },
];

export const RESEARCH_FILTER_GROUPS: MapFilterGroup[] = [
  {
    label: "Квалификация",
    options: [
      { value: "DEGREE", title: "С учёной степенью" },
      { value: "TITLE", title: "С учёным званием" },
    ],
  },
];
