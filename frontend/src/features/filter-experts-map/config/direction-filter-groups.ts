import type { MapFilterGroup } from "../model/types";

/** Параметры поиска кадастрового инженера, не требующие загрузки справочника. */
export const CADASTRAL_FILTER_GROUPS: MapFilterGroup[] = [
  {
    label: "Оснащение",
    options: [
      {
        value: "EQUIPMENT",
        title: "Есть необходимое оборудование",
      },
    ],
  },
];

/** Квалификация и место работы специалиста судебной экспертизы. */
export const FORENSIC_FILTER_GROUPS: MapFilterGroup[] = [
  {
    label: "Квалификация",
    options: [
      {
        value: "DEGREE",
        title: "С учёной степенью",
      },
      {
        value: "EXPERIENCE",
        title: "С опытом аналогичных экспертиз",
      },
    ],
  },
  {
    label: "Место работы",
    options: [
      {
        value: "WORKPLACE_ORGANIZATION",
        title: "Экспертная организация",
      },
      {
        value: "WORKPLACE_INDIVIDUAL",
        title: "Частный эксперт",
      },
    ],
  },
];
