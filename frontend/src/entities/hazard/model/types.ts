/** Профиль объекта, для которого сервер отдаёт свой набор факторов. */
export type HazardProfile = "rudnik" | "shahta";

/** Вариант ответа фактора; null означает «без оценки». */
export interface HazardOption {
  value: number | null;
  label: string;
}

/** Фактор опасности с вариантами выбора и значением по умолчанию. */
export interface HazardFactor {
  code: string;
  group: string;
  name: string;
  max_score: number;
  default_value: number | null;
  options: HazardOption[];
}

/** Группа факторов одного вида аварии: R0–R9. */
export interface HazardGroup {
  group: string;
  title: string;
  factors: HazardFactor[];
}

/** Справочник факторов профиля в порядке групп. */
export interface HazardCatalog {
  profile: HazardProfile;
  groups: HazardGroup[];
}

/** Выбранные значения по коду фактора. */
export interface HazardSelections {
  [code: string]: number | null;
}

/** Строки шапки PDF-отчёта в серверных названиях полей. */
export interface HazardReportHeader {
  author: string;
  intro_line1: string;
  intro_line2: string;
  intro_line3: string;
  justification: string;
  certificate: string;
  manufacturer: string;
}

/** Расчёт и шапка отчёта, которые сервер сохраняет в историю. */
export interface HazardReportRequest extends HazardReportHeader {
  profile: HazardProfile;
  selections: HazardSelections;
  report_name: string;
  excluded_groups: string[];
}

/** Показатель группы в сохранённом отчёте. */
export interface HazardReportBlock {
  group: string;
  title: string;
  value: number;
  category: string;
}

/** Сохранённый отчёт в истории эксперта. */
export interface HazardReport {
  id: number;
  name: string;
  profile: HazardProfile;
  overall_r: number;
  overall_category: string;
  blocks: HazardReportBlock[];
  created_at: string;
}
