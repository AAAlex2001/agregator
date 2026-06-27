export type HazardProfile = "rudnik" | "shahta";
export type HazardSelections = Record<string, number | null>;

export interface HazardOption {
  value: number | null;
  label: string;
}

export interface HazardFactor {
  code: string;
  group: string;
  name: string;
  max_score: number;
  default_value: number | null;
  options: HazardOption[];
}

export interface HazardGroup {
  group: string;
  title: string;
  factors: HazardFactor[];
}

export interface HazardCatalog {
  profile: string;
  groups: HazardGroup[];
}

export interface HazardBlock {
  group: string;
  title: string;
  value: number;
  category: string;
  sum_score: number;
  sum_max: number;
}

export interface HazardResult {
  profile: string;
  r0: HazardBlock;
  blocks: HazardBlock[];
  overall_r: number;
  overall_r_category: string;
  r_int: number;
  r_int_category: string;
}

export interface HazardReportItem {
  id: number;
  name: string;
  profile: string;
  overall_r: number;
  overall_category: string;
  created_at: string;
}
