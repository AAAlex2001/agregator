export type LiningSelections = Record<string, number | null>;
export type ElementCategories = Record<string, number>;
export type ExpertScores = Record<string, number>;

export interface LiningOption {
  value: number | null;
  label: string;
}

export interface LiningFactor {
  code: string;
  group: string;
  name: string;
  max_score: number;
  default_value: number | null;
  options: LiningOption[];
}

export interface LiningGroup {
  group: string;
  title: string;
  factors: LiningFactor[];
}

export interface LiningElement {
  id: number;
  group: string;
  name: string;
}

export interface LiningDamageCategory {
  id: number;
  reliability: number;
  epsilon: number;
  description: string;
}

export interface LiningCriterion {
  id: number;
  section: string;
  name: string;
  weight: number;
}

export interface LiningCatalog {
  profile: string;
  groups: LiningGroup[];
  elements: LiningElement[];
  element_group_titles: Record<string, string>;
  damage_categories: LiningDamageCategory[];
  expert_criteria: LiningCriterion[];
  expert_score_labels: Record<string, string>;
}

export interface LiningBlock {
  group: string;
  title: string;
  value: number;
  category: string;
  sum_score: number;
  sum_max: number;
}

export interface LiningElementResult {
  element_id: number;
  name: string;
  category: number;
  reliability: number;
  lam: number;
  t_capital: number | null;
  t_emergency: number | null;
}

export interface LiningResult {
  profile: string;
  r0: LiningBlock;
  blocks: LiningBlock[];
  overall_r: number;
  overall_r_category: string;
  r_int: number;
  r_int_category: string;
  elements: LiningElementResult[];
  final_capital: number;
  final_emergency: number;
  beta: number;
}

export interface LiningInput {
  profile: string;
  selections: LiningSelections;
  element_categories: ElementCategories;
  service_life_years: number;
  expert_scores: ExpertScores;
}

export interface LiningReportBlock {
  group: string;
  title: string;
  value: number;
  category: string;
}

export interface LiningReportItem {
  id: number;
  name: string;
  overall_r: number;
  overall_category: string;
  final_capital: number;
  final_emergency: number;
  blocks: LiningReportBlock[];
  created_at: string;
}
