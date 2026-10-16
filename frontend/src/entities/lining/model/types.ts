/** Вариант ответа фактора риска; null означает «без оценки». */
export interface LiningOption {
  value: number | null;
  label: string;
}

/** Фактор риска с вариантами выбора и значением по умолчанию. */
export interface LiningFactor {
  code: string;
  group: string;
  name: string;
  max_score: number;
  default_value: number | null;
  options: LiningOption[];
}

/** Группа факторов риска: R0, R2 или R7. */
export interface LiningGroup {
  group: string;
  title: string;
  factors: LiningFactor[];
}

/** Элемент крепи, для которого эксперт выбирает категорию состояния. */
export interface LiningElement {
  id: number;
  group: string;
  name: string;
}

/** Категория технического состояния элемента: от нормального до аварийного. */
export interface LiningDamageCategory {
  id: number;
  reliability: number;
  epsilon: number;
  description: string;
}

/** Условие надёжности для экспертной оценки с удельным весом. */
export interface LiningCriterion {
  id: number;
  section: string;
  name: string;
  weight: number;
}

/** Раздел экспертной оценки и его условия надёжности. */
export interface LiningCriteriaSection {
  title: string;
  criteria: LiningCriterion[];
}

/** Подписи групп элементов в порядке показа. */
export interface LiningElementGroupTitles {
  [group: string]: string;
}

/** Подписи экспертных баллов от 1 до 5. */
export interface LiningScoreLabels {
  [score: string]: string;
}

/** Справочник инструмента: факторы, элементы, категории состояния и критерии. */
export interface LiningCatalog {
  profile: string;
  groups: LiningGroup[];
  elements: LiningElement[];
  element_group_titles: LiningElementGroupTitles;
  damage_categories: LiningDamageCategory[];
  expert_criteria: LiningCriterion[];
  expert_score_labels: LiningScoreLabels;
}

/** Выбранные значения факторов по коду. */
export interface LiningSelections {
  [code: string]: number | null;
}

/** Категории состояния по id элемента крепи. */
export interface LiningElementCategories {
  [elementId: string]: number;
}

/** Экспертные баллы по id условия надёжности. */
export interface LiningExpertScores {
  [criterionId: string]: number;
}

/** Строки шапки PDF-отчёта в серверных названиях полей. */
export interface LiningReportHeader {
  author: string;
  intro_line1: string;
  intro_line2: string;
  intro_line3: string;
  justification: string;
  manufacturer: string;
}

/** Расчёт и шапка отчёта, которые сервер сохраняет в историю. */
export interface LiningReportRequest extends LiningReportHeader {
  profile: string;
  selections: LiningSelections;
  element_categories: LiningElementCategories;
  service_life_years: number;
  expert_scores: LiningExpertScores;
  report_name: string;
}

/** Показатель группы в сохранённом отчёте. */
export interface LiningReportBlock {
  group: string;
  title: string;
  value: number;
  category: string;
}

/** Сохранённый отчёт в истории эксперта: риск и сроки службы крепи. */
export interface LiningReport {
  id: number;
  name: string;
  overall_r: number;
  overall_category: string;
  final_capital: number;
  final_emergency: number;
  blocks: LiningReportBlock[];
  created_at: string;
}
