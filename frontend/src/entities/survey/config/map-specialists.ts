import type { SurveyKind, SurveyMapSpecialist } from "../model/types";

/** Виды изысканий и сокращения для фильтра карты исполнителей. */
export const SURVEY_MAP_KINDS: SurveyKind[] = [
  {
    code: "IGI",
    short: "ИГИ",
    title: "Инженерно-геологические изыскания",
  },
  {
    code: "IGDI",
    short: "ИГДИ",
    title: "Инженерно-геодезические изыскания",
  },
  {
    code: "IGMI",
    short: "ИГМИ",
    title: "Гидрометеорологические изыскания",
  },
  {
    code: "IEI",
    short: "ИЭИ",
    title: "Инженерно-экологические изыскания",
  },
  {
    code: "IGFI",
    short: "ИГФИ",
    title: "Инженерно-геофизические изыскания",
  },
  {
    code: "ARCH",
    short: "АРХ",
    title: "Археологические исследования",
  },
];

/** Специалисты изысканий, связанные с кодами профиля исполнителя. */
export const SURVEY_MAP_SPECIALISTS: SurveyMapSpecialist[] = [
  {
    key: "GEOLOGIST_FIELD",
    title: "Геолог полевых работ",
    kind: "IGI",
  },
  {
    key: "GEOLOGIST_OFFICE",
    title: "Геолог камеральных работ",
    kind: "IGI",
  },
  {
    key: "SOIL_LAB",
    title: "Специалист грунтоведческой лаборатории",
    kind: "IGI",
  },
  {
    key: "GEODESIST",
    title: "Геодезист",
    kind: "IGDI",
  },
  {
    key: "UAV_OPERATOR",
    title: "Оператор БПЛА",
    kind: "IGDI",
  },
  {
    key: "HYDROMETEOROLOGIST",
    title: "Инженер гидрометеоролог",
    kind: "IGMI",
  },
  {
    key: "ECOLOGIST",
    title: "Инженер эколог",
    kind: "IEI",
  },
  {
    key: "GEOPHYSICIST",
    title: "Инженер геофизик",
    kind: "IGFI",
  },
  {
    key: "ARCHAEOLOGIST",
    title: "Археолог",
    kind: "ARCH",
  },
];
