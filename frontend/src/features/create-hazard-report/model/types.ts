import type {
  HazardProfile,
  HazardReportHeader,
  HazardSelections,
} from "@/entities/hazard";

/** Строка шапки, которую эксперт заполняет вручную. */
export type HazardHeaderField = "author" | "intro_line2" | "justification";

/** Черновик отчёта: профиль, изменённые факторы, исключённые группы и шапка PDF. */
export interface HazardReportFormState {
  profile: HazardProfile;
  selections: HazardSelections;
  excludedGroups: string[];
  reportName: string;
  header: HazardReportHeader;
  isSubmitting: boolean;
}

/** Изменения черновика и результат отправки отчёта. */
export type HazardReportFormAction =
  | { type: "profile/change"; profile: HazardProfile }
  | { type: "option/select"; code: string; value: number | null }
  | { type: "group/toggle"; group: string }
  | { type: "report-name/change"; reportName: string }
  | { type: "header/change"; field: HazardHeaderField; value: string }
  | { type: "submit/start" }
  | { type: "submit/finish" };
