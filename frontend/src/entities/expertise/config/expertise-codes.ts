import type { ExpertiseCodeGroup } from "../model/types";

/** Строки кнопок областей аттестации в выборе требований к исполнителю. */
export const EXPERTISE_AREA_ROWS = [
  ["1", "2", "3.1", "3.2", "4", "5"],
  ["6", "7", "8", "9", "10", "11", "12"],
  ["13", "14.1", "14.2", "14.3", "14.4", "15"],
];

/** Области в прежнем порядке таблицы и формирования выбранных кодов. */
export const EXPERTISE_TABLE_AREAS = [
  "1", "2", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "15",
  "3.1", "3.2", "14.1", "14.2", "14.3", "14.4",
];

/** Области, где консервация/ликвидация и техническое перевооружение выбираются отдельно. */
const SEPARATE_DOCUMENT_AREAS = ["4", "5", "7", "8", "11"];

/** Области, в которых доступна экспертиза декларации промышленной безопасности. */
const DECLARATION_AREAS = [
  "2", "4", "5", "6", "7", "8", "9", "10", "11", "13", "3.1", "3.2",
];

/** Допустимые сочетания объекта экспертизы и области аттестации из исходной таблицы. */
export const EXPERTISE_CODE_GROUPS: ExpertiseCodeGroup[] = [
  {
    type: "КЛ",
    areas: SEPARATE_DOCUMENT_AREAS,
  },
  {
    type: "ТП",
    areas: SEPARATE_DOCUMENT_AREAS,
  },
  {
    type: "КЛ/ТП",
    areas: EXPERTISE_TABLE_AREAS.filter((area) => !SEPARATE_DOCUMENT_AREAS.includes(area)),
  },
  {
    type: "ЗС",
    areas: EXPERTISE_TABLE_AREAS,
  },
  {
    type: "ТУ",
    areas: EXPERTISE_TABLE_AREAS,
  },
  {
    type: "Д",
    areas: DECLARATION_AREAS,
  },
  {
    type: "ОБ",
    areas: EXPERTISE_TABLE_AREAS,
  },
];
