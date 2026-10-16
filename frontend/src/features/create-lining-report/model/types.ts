import type {
  LiningElementCategories,
  LiningExpertScores,
  LiningReportHeader,
  LiningSelections,
} from "@/entities/lining";

/** Строка шапки, которую эксперт заполняет вручную. */
export type LiningHeaderField = "author" | "intro_line2" | "justification";

/** Черновик отчёта: изменённые факторы, категории элементов, баллы, срок и шапка PDF. */
export interface LiningReportFormState {
  selections: LiningSelections;
  elementCategories: LiningElementCategories;
  expertScores: LiningExpertScores;
  serviceLife: string;
  reportName: string;
  header: LiningReportHeader;
  isSubmitting: boolean;
}

/** Изменения черновика и результат отправки отчёта. */
export type LiningReportFormAction =
  | { type: "option/select"; code: string; value: number | null }
  | { type: "element/select"; elementId: number; category: number }
  | { type: "score/select"; criterionId: number; score: number }
  | { type: "service-life/change"; serviceLife: string }
  | { type: "report-name/change"; reportName: string }
  | { type: "header/change"; field: LiningHeaderField; value: string }
  | { type: "submit/start" }
  | { type: "submit/finish" };
